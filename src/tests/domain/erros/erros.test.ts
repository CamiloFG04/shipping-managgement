import { CustomError } from "../../../domain/errors/custom.error";

describe("CustomError", () => {
    it("should create an instance of CustomError with correct statusCode and message", () => {
        const error = new CustomError(400, "Bad Request");

        expect(error).toBeInstanceOf(CustomError);
        expect(error).toBeInstanceOf(Error); // Verifica que hereda de Error
        expect(error.statusCode).toBe(400);
        expect(error.message).toBe("Bad Request");
    });
    describe("CustomError static methods", () => {
        it("should create a badRequest error", () => {
            const error = CustomError.badRequest("Invalid input");

            expect(error).toBeInstanceOf(CustomError);
            expect(error.statusCode).toBe(400);
            expect(error.message).toBe("Invalid input");
        });

        it("should create an unauthorized error", () => {
            const error = CustomError.unauthorized("Unauthorized");

            expect(error).toBeInstanceOf(CustomError);
            expect(error.statusCode).toBe(401);
            expect(error.message).toBe("Unauthorized");
        });

        it("should create a forbidden error", () => {
            const error = CustomError.forbidden("Forbidden");

            expect(error).toBeInstanceOf(CustomError);
            expect(error.statusCode).toBe(403);
            expect(error.message).toBe("Forbidden");
        });

        it("should create a notFound error", () => {
            const error = CustomError.notFound("Resource not found");

            expect(error).toBeInstanceOf(CustomError);
            expect(error.statusCode).toBe(404);
            expect(error.message).toBe("Resource not found");
        });

        it("should create an internalServerError with default message", () => {
            const error = CustomError.internalServerError();

            expect(error).toBeInstanceOf(CustomError);
            expect(error.statusCode).toBe(500);
            expect(error.message).toBe("Internal Server Error");
        });

        it("should create an internalServerError with custom message", () => {
            const error = CustomError.internalServerError(
                "Something went wrong"
            );

            expect(error).toBeInstanceOf(CustomError);
            expect(error.statusCode).toBe(500);
            expect(error.message).toBe("Something went wrong");
        });

        it("should have the correct prototype chain", () => {
            const error = new CustomError(400, "Bad Request");

            expect(error).toBeInstanceOf(Error); // Verifica que hereda de Error
            expect(error).toBeInstanceOf(CustomError); // Verifica que es una instancia de CustomError
            expect(Object.getPrototypeOf(error)).toBe(CustomError.prototype); // Verifica la cadena de prototipos
        });
    });
});
