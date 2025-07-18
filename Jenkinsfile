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
                        -Dsonar.token=%SONAR_TOKEN%
                    '''
                }
            }
        }

        stage('Rebuild & Run Containers') {
            steps {
                bat '''
                    echo Stopping and removing any existing quicktask-mongo container if exists
                    docker stop quicktask-mongo || echo quicktask-mongo not running
                    docker rm quicktask-mongo || echo quicktask-mongo not present

                    echo Bringing down existing docker-compose containers
                    docker-compose down --remove-orphans

                    echo Rebuilding containers without cache
                    docker-compose build --no-cache

                    echo Starting containers
                    docker-compose up -d

                    echo Listing all running containers
                    docker ps
                '''
            }
        }

        stage('Run Backend Tests') {
            steps {
                bat '''
                    echo Cleaning old backend test report if exists
                    del /F /Q backend\\backend-test-results.xml 2>nul

                    echo Installing dependencies in backend container
                    docker exec quicktask-pipeline-backend-1 npm install

                    echo Running backend tests with JUnit output
                    docker exec quicktask-pipeline-backend-1 npm test

                    echo Copying backend test report from container to workspace
                    docker cp quicktask-pipeline-backend-1:/app/backend/backend-test-results.xml backend\\backend-test-results.xml
                '''
            }
        }

        stage('Run Frontend Tests') {
            steps {
                dir('frontend') {
                    bat '''
                        echo Cleaning old frontend test report if exists
                        del /F /Q frontend-test-results.xml 2>nul

                        npm install

                        echo Running frontend tests and generating junit report
                        npm test -- --ci --reporters=default --reporters=jest-junit
                    '''
                }
            }
        }

        stage('Publish Test Results') {
            steps {
                junit 'backend/backend-test-results.xml'
                junit 'frontend/frontend-test-results.xml'
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
            bat 'docker-compose down'
        }
    }
}
