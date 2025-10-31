create table roles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE
);
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255),
    last_name VARCHAR(255),
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL
);

create table user_role (
    user_id BIGINT NOT NULL ,
    role_id BIGINT NOT NULL ,
    PRIMARY KEY (user_id,role_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE ,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

insert into roles(id, name)
values (1,"USER"),
       (2,"ADMIN");

drop table user_role;
drop table roles;
drop table users;

select * from users;

select * from roles;