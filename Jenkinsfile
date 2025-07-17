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

        stage('SonarQube Analysis') {
            steps {
                withSonarQubeEnv('My SonarQube Server') {
                    bat 'sonar-scanner -Dsonar.login=squ_e2ddd670488a09e29ebef5b34d4be0b86dba123'
                }
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

        stage('Run Backend Tests') {
            steps {
                dir('backend') {
                    bat 'npm install'
                    bat 'npm test -- --ci --reporters=default --reporters=jest-junit'
                }
            }
        }

        stage('Run Frontend Tests') {
            steps {
                dir('frontend') {
                    bat 'npm install'
                    bat 'npm test -- --ci --reporters=default --reporters=jest-junit'
                }
            }
        }

        stage('Publish Test Results') {
            steps {
                junit '**/test-results.xml'
            }
        }

        stage('Check Backend Logs (Optional)') {
            steps {
                bat 'docker logs quicktask-pipeline-backend-1 || echo "⚠️ Backend log unavailable (container might not be ready yet)"'
            }
        }
    }
}

