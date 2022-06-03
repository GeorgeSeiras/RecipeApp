GRANT ALL PRIVILEGES ON DATABASE recipeapp TO recipeadmin;
\l
\c recipeapp
set search_path to "recipeapp";
\dt
-- INSERT INTO user_user (username,password,email,is_active,is_staff) VALUES ("admin","password","it21765@hua.gr",TRUE,TRUE)