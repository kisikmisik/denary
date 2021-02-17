import * as request from "supertest";
import Application from "./../api/app";

describe("Primary server instances and database connection", () => {

    test("Application instance is created successful", () => {
        const application = new Application();
        expect(application.databaseConnectionHelper).toBeDefined();
        expect(application.server).toBeDefined();
        expect(application.routesHelper).toBeDefined();
    });

    test("Database connection is created successfully", (done) => {
        const application = new Application();
        application.databaseConnectionHelper.createConnection().then( async (connection) => {
            expect(connection.isConnected).toBe(true);
            await connection.close();
            done();
        });
    });

});

describe("Primary routes tests", () => {

    test("Should response with not found message", async (done) => {
      const application = new Application();
      const response = await request(application.server).get("/");
      expect(response.status).toEqual(404);
      done();
    });

    
});
