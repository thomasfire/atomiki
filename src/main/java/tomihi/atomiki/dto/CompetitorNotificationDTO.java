package tomihi.atomiki.dto;

import lombok.Data;

@Data
public class CompetitorNotificationDTO {
    public enum NOTIFICATION_TYPES {
        COMPETITOR_SET,
        COMPETITOR_MARKED,
        COMPETITOR_MOVED,
        COMPETITOR_FINISHED,
        OWNER_FINISHED
    }

    NOTIFICATION_TYPES type;
    String message;
    Object payload;


    public CompetitorNotificationDTO(NOTIFICATION_TYPES type, String message, Object payload) {
        this.type = type;
        this.message = message;
        this.payload = payload;
    }

    public CompetitorNotificationDTO() {
    }
}
