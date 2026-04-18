package com.nexus.scampus.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class BookingActionRequest {

    @Size(max = 500, message = "Note must not exceed 500 characters")
    private String adminNote;
}