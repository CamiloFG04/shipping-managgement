export class TrackingCode {
    static get generateTrackingCode() {
        const prefix = "TRK";
        const timestamp = Date.now().toString(36).toUpperCase();
        const randomPart = Math.random()
            .toString(36)
            .substring(2, 6)
            .toUpperCase();

        const remainingLength = 8;
        const combinedPart = (timestamp + randomPart).slice(0, remainingLength);
        return `${prefix}${combinedPart}`;
    }
}
