package com.fitto.common.event;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

/**
 * 커플 관계 채널(/sub/couple/{relationId})로 실시간 이벤트를 발행한다.
 */
@Component
public class CoupleEventPublisher {

    private final SimpMessagingTemplate messagingTemplate;

    public CoupleEventPublisher(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    public void publish(Long relationId, String type) {
        if (relationId == null) return;
        messagingTemplate.convertAndSend("/sub/couple/" + relationId, new CoupleEvent(type));
    }
}
