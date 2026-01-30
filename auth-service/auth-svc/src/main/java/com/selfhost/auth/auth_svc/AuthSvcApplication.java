package com.selfhost.auth.auth_svc;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class AuthSvcApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthSvcApplication.class, args);
	}

}