import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Endpoint } from "@/lib/api";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const generateCodeSnippet = (
  endpoint: Endpoint,
  language: string,
  username: string,
) => {
  let variables = {};

  switch (endpoint.id) {
    case "problemProgress":
      variables = { userSlug: username };
      break;
    case "recentSubmissions":
      variables = { username, limit: 20 };
      break;
    case "challengeMedal":
      variables = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
      };
      break;
    case "streakCounter":
    case "currentTimestamp":
    case "dailyChallenge":
    case "upcomingContests":
      variables = {};
      break;
    default:
      if (
        endpoint.variables &&
        Object.keys(endpoint.variables).includes("username")
      ) {
        variables = { username };
      }
  }

  const payload = {
    query: endpoint.graphql,
    variables,
    operationName: endpoint.query,
  };

  switch (language) {
    case "typescript":
      return `// TypeScript/JavaScript
const response = await fetch('/api/leetcode', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(${JSON.stringify(payload, null, 2)})
});

const data = await response.json();
console.log(data);`;

    case "python":
      return `# Python
import requests
import json

url = "/api/leetcode"
payload = ${JSON.stringify(payload, null, 2).replace(/"/g, '"')}

response = requests.post(url, json=payload)
data = response.json()
print(json.dumps(data, indent=2))`;

    case "golang":
      return `// Go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
)

func main() {
    url := "/api/leetcode"
    payload := map[string]interface{}{
        "query": \`${endpoint.graphql}\`,
        "variables": ${JSON.stringify(JSON.parse(JSON.stringify(variables)))},
        "operationName": "${endpoint.query}",
    }

    jsonPayload, _ := json.Marshal(payload)
    resp, err := http.Post(url, "application/json", bytes.NewBuffer(jsonPayload))
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    var result map[string]interface{}
    json.NewDecoder(resp.Body).Decode(&result)
    fmt.Printf("%+v\\n", result)
}`;

    case "cpp":
      return `// C++ (using libcurl)
#include <iostream>
#include <string>
#include <curl/curl.h>
#include <json/json.h>

size_t WriteCallback(void* contents, size_t size, size_t nmemb, std::string* data) {
    data->append((char*)contents, size * nmemb);
    return size * nmemb;
}

int main() {
    CURL* curl;
    CURLcode res;
    std::string response;

    curl = curl_easy_init();
    if(curl) {
        std::string payload = R"(${JSON.stringify(payload)})";

        curl_easy_setopt(curl, CURLOPT_URL, "/api/leetcode");
        curl_easy_setopt(curl, CURLOPT_POSTFIELDS, payload.c_str());
        curl_easy_setopt(curl, CURLOPT_WRITEFUNCTION, WriteCallback);
        curl_easy_setopt(curl, CURLOPT_WRITEDATA, &response);

        struct curl_slist* headers = NULL;
        headers = curl_slist_append(headers, "Content-Type: application/json");
        curl_easy_setopt(curl, CURLOPT_HTTPHEADER, headers);

        res = curl_easy_perform(curl);
        curl_easy_cleanup(curl);
        curl_slist_free_all(headers);
    }

    std::cout << response << std::endl;
    return 0;
}`;

    default:
      return "";
  }
};
