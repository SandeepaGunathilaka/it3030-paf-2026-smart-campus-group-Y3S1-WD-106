package com.nexus.scampus.dto.response;

import com.nexus.scampus.model.enums.BookingStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class BookingResponse {

    private Long id;
    private Long resourceId;

    private Long   userId;
    private String userName;
    private String userEmail;

    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String        purpose;
    private Integer       expectedAttendees;
    private BookingStatus status;
    private String        adminNote;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}