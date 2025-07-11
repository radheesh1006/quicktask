pipeline {
  agent any

  stages {
    stage('Clone Repository') {
      steps {
        git 'https://github.com/radheesh1006/quicktask.git'
      }
    }

    stage('Build Docker Images') {
      steps {
        bat 'docker-compose build --no-cache'
      }
    }

    stage('Run Containers') {
      steps {
        bat 'docker-compose up -d'
      }
    }
  }
}
