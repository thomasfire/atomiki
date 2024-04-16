package tomihi.atomiki.utils;

import java.util.UUID;

public class UUIDHelper {
    public static String generateUUID() {
        return UUID.randomUUID().toString().replace("-","").substring(0,12);
    }
}
