package tomihi.atomiki.dto;

import lombok.Data;

@Data
public class SocketTypeWrapper {
    public enum SocketTypes {
        ATOM_MARK,
        ATOM_SET,
        LOG_ENTRY,
    }
    SocketTypeWrapper.SocketTypes type;
    Object payload;

    public SocketTypeWrapper(SocketTypeWrapper.SocketTypes type, Object payload) {
        this.type = type;
        this.payload = payload;
    }
}
