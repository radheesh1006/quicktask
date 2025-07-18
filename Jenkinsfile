pipeline {
    agent any

    environment {
        COMPOSE_PROJECT_NAME = "quicktask-pipeline"
        SONAR_TOKEN = credentials('SONAR_TOKEN')
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
                        -Dsonar.token=%SONAR_TOKEN%
                    '''
                }
            }
        }

        stage('Rebuild & Run Containers') {
            steps {
                bat '''
                    docker stop quicktask-mongo || echo quicktask-mongo not running
                    docker rm quicktask-mongo || echo quicktask-mongo not present

                    docker-compose down --remove-orphans || echo docker-compose down failed
                    docker-compose build --no-cache || exit /b 1
                    docker-compose up -d || exit /b 1
                    docker ps
                '''
            }
        }

        stage('Run Backend Tests') {
            steps {
                bat '''
                    del /F /Q backend\\backend-test-results.xml 2>nul
                    docker exec quicktask-pipeline-backend-1 npm install
                    docker exec quicktask-pipeline-backend-1 npm test
                    docker cp quicktask-pipeline-backend-1:/app/backend/backend-test-results.xml backend\\backend-test-results.xml
                '''
            }
        }

        stage('Publish Test Results') {
            steps {
                junit 'backend/backend-test-results.xml'
            }
        }

        stage('Check Backend Logs (Optional)') {
            steps {
                catchError(buildResult: 'SUCCESS', stageResult: 'UNSTABLE') {
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

    post {
        always {
            bat '''
                docker image prune -f
            '''
        }
    }
}
