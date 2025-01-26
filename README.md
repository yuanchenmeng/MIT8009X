
# Table of Contents

- [About the Project](#about-the-project)
  * [Screenshots](#screenshots)
  * [Features](#features)
- [Getting Started](#getting-started)
  * [Run Locally](#run-locally)
  * [Deployment](#deployment)
- [Usage](#usage)
- [TechStack](#TechStack)
  

<!-- About the Project -->
## About the Project
Front End Address: https://dev.d2bm53lbvyo2ld.amplifyapp.com/
Back End Address: https://jd4i7vga437hv4bzrjm6rqanui0vzbir.lambda-url.us-east-1.on.aws/

<!-- Screenshots -->
### Screenshots

<div align="center"> 
  <img src="https://j19mc.s3.us-east-1.amazonaws.com/show.png" alt="screenshot" />
</div>



<!-- Features -->
### Features

- User Signup/Login
- Projects CRUD
- OAuth Login
- Search Filter Projects


<!-- Getting Started -->
## Getting Started

This project uses npm as package manager. 

Backend
```bash
 cd backend
 npm run install
 npm install -g serverless
```

Frontend
```bash
 cd frontend
 npm run install
 npm install -g amplify
```



<!-- Run Locally -->
### Run Locally

Clone the project and run backend

```bash
  git clone https://github.com/yuanchenmeng/MIT8009X.git
  cd backend
  npm run start
```

run the frontend
```bash
  cd frontend
  npm run start
```



<!-- Deployment -->
### Deployment

#### Backend
Enter serverless or sls in shell to generate serverless.yml File
Edit serverless.yml file. Then,
```bash
  serverless deploy
  npm run start
```

#### Frontend

To configure AWS Amplify (New hosting for project)
```bash
  amplify configure
  amplify init
  amplify add hosting
  amplify push
```

Redeploy 
```bash
  npm run build
  amplify publish
```



<!-- Usage -->
## Usage

#### User Signup/Login
Navigate to '/' Home page. There are choices of Login/Log out/Sign up. 

#### Projects CRUD
To achieve Projects CRUD. 
* Views/Read: All project view, My Project view, One Project Detail View
* Delete/Edit: Edit projects by clicking bottom right 'EDIT' icon in Project Detail View
* Add: Add projects by clicking bottom right 'ADD' icon (Only available to logged in users)
My Project view is only available for logged in users
Detailed view of one project can be viewed by clicking the project in all project view or my project view. 

#### OAuth Login
Google OAuth is configured to support quick login/log out. Signup at this moment is not available yet. 
#### Search Filter Projects
Search and filter features are available in all project view. Search supports search the matched keywords in project title, project description, project tags. 
Empty Search keywords or Empty filter won't do filtering. If multiple tags are selected, only projects match all selected tags will be shown.



<!-- TechStack -->

## TechStack
Frontend: React.js Material UI
Backend: Node.js express.js
DB: AWS RDS MySQL
Deployment: AWS S3, VPC, Lambda, Amplify, API Gateway
