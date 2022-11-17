import fetch from "node-fetch";

async function getToken() {
  const token = await fetch("https://api.ebay.com/identity/v1/oauth2/token", {
    method: "POST",
    headers: {
      "Authorization":
        "Basic SmlicmFuRGUtZ3JvdXAtUFJELWQxNmJiYzM4My0xN2I3NGI5NTpQUkQtMTZiYmMzODMyNDhmLTVjNTQtNDRlZS1hYzMzLTQxMGI=",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      "grant_type": "client_credentials",
      "scope": "https://api.ebay.com/oauth/api_scope"
    })
  });
  const data = await token.json();
  console.log(data.access_token);
}

getToken();
