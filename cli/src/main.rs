use clap::{Parser, Subcommand};
use reqwest::blocking::Client;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::PathBuf;

#[derive(Parser)]
#[command(name = "recap", about = "Recap - Bookmark manager CLI")]
struct Cli {
    #[command(subcommand)]
    command: Commands,

    /// API server URL
    #[arg(short, long, default_value = "http://localhost:3000")]
    server: String,

    /// API key
    #[arg(short, long)]
    key: Option<String>,
}

#[derive(Subcommand)]
enum Commands {
    /// Add a new bookmark
    Add {
        /// URL to bookmark
        url: String,
        /// Title
        #[arg(short, long)]
        title: Option<String>,
        /// Tags (comma separated)
        #[arg(short, long)]
        tags: Option<String>,
        /// Collection name
        #[arg(short, long)]
        collection: Option<String>,
    },
    /// Search bookmarks
    Search {
        /// Search query
        query: String,
    },
    /// List recent bookmarks
    List {
        /// Number to show
        #[arg(short, long, default_value = "10")]
        limit: u32,
    },
    /// Login and save credentials
    Login {
        /// Email
        email: String,
        /// Password
        password: String,
    },
}

#[derive(Serialize)]
struct AddBookmarkBody {
    url: String,
    title: Option<String>,
    tags: Option<Vec<String>>,
}

#[derive(Deserialize)]
struct BookmarkResponse {
    id: String,
    url: String,
    title: Option<String>,
    domain: Option<String>,
    #[allow(dead_code)]
    tags: Option<Vec<TagResponse>>,
}

#[derive(Deserialize)]
struct TagResponse {
    name: String,
}

#[derive(Deserialize)]
struct BookmarksListResponse {
    bookmarks: Vec<BookmarkResponse>,
    total: u32,
}

#[derive(Serialize, Deserialize)]
struct Credentials {
    email: String,
    password: String,
    server: String,
}

fn get_credentials_path() -> PathBuf {
    let mut path = dirs::config_dir().unwrap_or_else(|| PathBuf::from("."));
    path.push("recap");
    fs::create_dir_all(&path).ok();
    path.push("credentials.json");
    path
}

fn save_credentials(creds: &Credentials) {
    let path = get_credentials_path();
    if let Ok(json) = serde_json::to_string_pretty(creds) {
        fs::write(path, json).ok();
    }
}

fn load_credentials() -> Option<Credentials> {
    let path = get_credentials_path();
    if let Ok(content) = fs::read_to_string(path) {
        serde_json::from_str(&content).ok()
    } else {
        None
    }
}

fn get_client(server: &str) -> Client {
    Client::builder()
        .cookie_store(true)
        .build()
        .expect("Failed to build HTTP client")
}

fn login(client: &Client, server: &str, email: &str, password: &str) -> Result<(), String> {
    let res = client
        .post(format!("{}/api/auth/callback/credentials", server))
        .form(&[("email", email), ("password", password), ("csrf", "")])
        .send()
        .map_err(|e| format!("Connection failed: {}", e))?;

    if res.status().is_success() || res.status().as_u16() == 302 {
        save_credentials(&Credentials {
            email: email.to_string(),
            password: password.to_string(),
            server: server.to_string(),
        });
        println!("✓ Logged in successfully");
        Ok(())
    } else {
        Err(format!("Login failed: HTTP {}", res.status()))
    }
}

fn main() {
    let cli = Cli::parse();

    match &cli.command {
        Commands::Login { email, password } => {
            let client = get_client(&cli.server);
            match login(&client, &cli.server, email, password) {
                Ok(_) => {}
                Err(e) => eprintln!("Error: {}", e),
            }
        }
        Commands::Add { url, title, tags, collection: _ } => {
            let creds = load_credentials().unwrap_or_else(|| {
                eprintln!("Not logged in. Run 'recap login' first.");
                std::process::exit(1);
            });

            let client = get_client(&creds.server);
            let _ = login(&client, &creds.server, &creds.email, &creds.password);

            let tag_vec = tags.as_ref().map(|t| t.split(',').map(|s| s.trim().to_string()).collect());

            let body = AddBookmarkBody {
                url: url.clone(),
                title: title.clone(),
                tags: tag_vec,
            };

            match client
                .post(format!("{}/api/bookmarks", creds.server))
                .json(&body)
                .send()
            {
                Ok(res) if res.status().is_success() => {
                    println!("✓ Bookmark saved: {}", url);
                }
                Ok(res) => {
                    eprintln!("Error: HTTP {}", res.status());
                }
                Err(e) => {
                    eprintln!("Failed: {}", e);
                }
            }
        }
        Commands::Search { query } => {
            let creds = load_credentials().unwrap_or_else(|| {
                eprintln!("Not logged in. Run 'recap login' first.");
                std::process::exit(1);
            });

            let client = get_client(&creds.server);
            let _ = login(&client, &creds.server, &creds.email, &creds.password);

            match client
                .get(format!("{}/api/bookmarks?search={}&limit=20", creds.server, query))
                .send()
            {
                Ok(res) if res.status().is_success() => {
                    if let Ok(data) = res.json::<BookmarksListResponse>() {
                        if data.bookmarks.is_empty() {
                            println!("No results for '{}'", query);
                        } else {
                            println!("Found {} results:\n", data.total);
                            for b in &data.bookmarks {
                                let title = b.title.as_deref().unwrap_or(&b.url);
                                println!("  • {} ({})", title, b.url);
                            }
                        }
                    }
                }
                Ok(res) => {
                    eprintln!("Error: HTTP {}", res.status());
                }
                Err(e) => {
                    eprintln!("Failed: {}", e);
                }
            }
        }
        Commands::List { limit } => {
            let creds = load_credentials().unwrap_or_else(|| {
                eprintln!("Not logged in. Run 'recap login' first.");
                std::process::exit(1);
            });

            let client = get_client(&creds.server);
            let _ = login(&client, &creds.server, &creds.email, &creds.password);

            match client
                .get(format!("{}/api/bookmarks?limit={}", creds.server, limit))
                .send()
            {
                Ok(res) if res.status().is_success() => {
                    if let Ok(data) = res.json::<BookmarksListResponse>() {
                        if data.bookmarks.is_empty() {
                            println!("No bookmarks yet");
                        } else {
                            println!("Recent bookmarks:\n");
                            for b in &data.bookmarks {
                                let title = b.title.as_deref().unwrap_or(&b.url);
                                let domain = b.domain.as_deref().unwrap_or("unknown");
                                println!("  • {} ({} - {})", title, domain, b.url);
                            }
                        }
                    }
                }
                Ok(res) => {
                    eprintln!("Error: HTTP {}", res.status());
                }
                Err(e) => {
                    eprintln!("Failed: {}", e);
                }
            }
        }
    }
}
