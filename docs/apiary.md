# API

***Add Project***
----
Add a project 

* **URL**

  /project

* **Method:**
  
    `POST`
  
*  **URL Params**

    None


* **Data Params**
    JSON object : 
    ```json
    {
        "url": "<string>"
    }
    ```
    OR
    ```json
    {
        "org": "<string>",
        "repo":"<string>"
    }
    ```
 
   `url` : github url for the repository

    `org` : organization / owner name

    `repo` : repository name

* **Success Response:**

  * **Code:** 202 <br />
    **Content:** 
    ```json 
    { 
        "ok" : true,
        "message" : "Project foo/bar added with success"
    } 
    ```
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** 
    ```json 
    { 
        "ok" : false,
        "message" : "Missing project's url or org and repo"
    } 
    ```

  OR

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:**
    ```json 
    { 
        "ok" : false,
        "message" : "Error message"
    } 
    ```

* **Sample Call:**
    ```javascript
    const request = require('request');

    request({
    method: 'POST',
    url: '/project',
    body: "{  \"org\": \"foo\", \"repo\":\"bar\"}"
    }, function (error, response, body) {
    console.log('Status:', response.statusCode);
    console.log('Response:', body);
    });
    ```

***Get Commit***
----
Get the list of commits from a project

* **URL**

  /project/:org/:repo/commits

* **Method:**
  
    `GET`
  
*  **URL Params**
   **Required:**
 
   `org=[string]`

   organization / owner name

    `repo=[string]`

    repository name
    **Optional:**
 
   `forcerefresh=[boolean]`

   It will force a fetch recent data from remote origin


* **Data Params**
    
    None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    ```json 
    {
        "ok" : true,
        "message" : "Commits for project foo/bar retrieved with success",
        "commitsNumber" : 1,
        "commits" : [ {
            "hash" : "dd2bc4b0f6f4",
            "author" : "Darth Vader",
            "timestamp": "1980-12-19T20:00:00+01:0",
            "Message":"I am your father"
        }

        ]
    }
    ```
    If `forcerefresh=true` is used the system will try to predict if will take time to fetch the commits and will generate a task

  * **Code:** 202 <br />
    **Content:** 
    ```json 
    {
        "ok" : true,
        "message" : "Fetching commits a task was created",
        "taskID" : "HqKL0qRoqm",
    }
    ```
 
* **Error Response:**

  * **Code:** 400 BAD REQUEST <br />
    **Content:** 
    ```json 
    { 
        "ok" : false,
        "message" :  "Missing parameters"
    } 
    ```

  OR

  * **Code:** 500 INTERNAL SERVER ERROR <br />
    **Content:** 
    ```json 
    { 
        "ok" : false,
        "message" : "Error message"
    }
    ``` 

* **Sample Call:**
    ```javascript
    const request = require('request');

    request({
    method: 'GET',
    url: '/project/foo/bar/commits'
    }, function (error, response, body) {
    console.log('Status:', response.statusCode);
    console.log('Response:', body);
    });
    ```