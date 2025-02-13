export class TrackingCode {
    static get generateTrackingCode() {
        const prefix = "TRK";
        const timestamp = Date.now().toString(36).toUpperCase();
        const randomPart = Math.random()
            .toString(36)
            .substring(2, 6)
            .toUpperCase();

        return `${prefix}${timestamp}${randomPart}`;
    }
}
