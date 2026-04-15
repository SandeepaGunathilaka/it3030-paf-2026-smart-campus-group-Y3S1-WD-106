package com.nexus.scampus.repository;

import com.nexus.scampus.model.User;
import com.nexus.scampus.model.enums.AccountStatus;
import com.nexus.scampus.model.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByGoogleId(String googleId);
    boolean existsByEmail(String email);
    boolean existsByGoogleId(String googleId);
    List<User> findByRole(Role role);
    List<User> findByStatus(AccountStatus status);
    List<User> findByRoleNot(Role role);
}
