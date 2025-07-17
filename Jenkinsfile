pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = "quicktask-pipeline"
        SONAR_TOKEN = credentials('SONAR_TOKEN')  // Jenkins credential ID for Sonar token
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
                    bat '''
                        sonar-scanner ^
                        -Dsonar.projectKey=quicktask ^
                        -Dsonar.projectName=QuickTask ^
                        -Dsonar.projectVersion=1.0 ^
                        -Dsonar.sources=backend,frontend ^
                        -Dsonar.exclusions=**/node_modules/** ^
                        -Dsonar.host.url=http://localhost:9000 ^
                        -Dsonar.token=%SONAR_TOKEN%
                    '''
                }
            }
        }

        stage('Rebuild & Run Containers') {
            steps {
                bat 'docker-compose down --remove-orphans'
                bat 'docker-compose build --no-cache'
                bat 'docker-compose up -d'
                bat 'docker ps'
            }
        }

        stage('Run Backend Tests') {
            steps {
                dir('backend') {
                    bat 'npm install'
                    bat 'npm install --save-dev supertest jest-junit'
                    bat 'npm test -- --ci --reporters=default --reporters=jest-junit --outputFile=../backend-test-results.xml'
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
                junit '**/backend-test-results.xml'
            }
        }

        stage('Check Backend Logs (Optional)') {
            steps {
                bat '''
                    for /l %%x in (1, 1, 3) do (
                        docker logs quicktask-pipeline-backend-1 && goto success
                        timeout /t 5
                    )
                    echo "⚠️ Backend log unavailable (container might not be ready yet)"
                    :success
                '''
            }
        }
    }
}
