pipeline {
  agent any

  environment {
    COMPOSE_PROJECT_NAME = "quicktask-pipeline"
  }

  stages {
    stage('Clone Repository') {
      steps {
        git branch: 'main', url: 'https://github.com/radheesh1006/quicktask.git'
      }
    }

    stage('Rebuild & Run Containers') {
      steps {
        dir('') {
          bat 'docker-compose down --remove-orphans'
          bat 'docker-compose build --no-cache'
          bat 'docker-compose up -d'
        }
      }
    }

    stage('Check Backend Logs (Optional)') {
      steps {
        bat 'docker logs quicktask-pipeline-backend-1 || echo "⚠️ Backend log unavailable (container might not be ready yet)"'
      }
    }
  }
}
