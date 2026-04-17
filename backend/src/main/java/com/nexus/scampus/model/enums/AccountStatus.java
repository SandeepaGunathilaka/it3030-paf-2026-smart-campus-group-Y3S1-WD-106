package com.nexus.scampus.model.enums;

public enum AccountStatus {
    PENDING,   // just signed up via Google, awaiting admin approval
    ACTIVE,    // approved — can access the system
    REJECTED   // rejected by admin
}
