import { appRoutes } from "@/routes/AppRoutes";


describe("appRoutes config", () => {
    it("should contain Usuario and Admin groups", () => {
        expect(appRoutes.length).toBe(2);

        expect(appRoutes[0].name).toBe("Usuario");
        expect(appRoutes[1].name).toBe("Admin");
    });

    it("should contain protected user routes", () => {
        const userChildren = appRoutes[0].children!;
        const protectedRoutes = userChildren.filter(r => r.protected);

        expect(protectedRoutes.length).toBe(3);
    });
});
