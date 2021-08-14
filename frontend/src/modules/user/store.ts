import { defineStore } from "pinia";
import axios from "axios";
import { cloneDeep, omit } from "lodash";
import * as UserService from "@/services/user";
import { Toast, Association } from "@/modules";

export const useStore = defineStore({
    id: "user",
    actions: {
        async disconnect() {
            await Toast.testRequest(async () => {
                return await UserService.disconnect();
            });

            this.$reset();
        },
        async init() {
            try {
                const userData = await UserService.ping();
                this.$patch(omit(userData, "association"));
                const associationStore = Association.useStore();

                if (userData.association) {
                    associationStore.init(userData.association);
                }
                else {
                    associationStore.$reset();
                }
            }
            catch (error) {
                if (!axios.isAxiosError(error)) {
                    throw error;
                }
            }
        },
        async update({ password, student, username }: { password: { new: string; old: string }; student: {name: string}; username: string }) {
            const response = await Toast.testRequest(async () => {
                return await UserService.update({ password, student, username });
            });

            if (response?.success) {
                this.username = username;
                this.student.name = student.name;
            }
        },
        async updatePlatforms(platforms: {discord: string}) {
            const response = await Toast.testRequest(async () => {
                return await UserService.updatePlatforms(platforms);
            });

            if (response?.success) {
                this.platforms = cloneDeep(platforms);
            }
        },
        async uploadAvatar(file: File) {
            const response = await Toast.testRequest(async () => {
                return await UserService.uploadAvatar({ file });
            });

            if (response?.success) {
                this.avatar = response.avatar;
            }
        }
    },
    getters: {
        getAvatarUrl(): string{
            return UserService.getAvatarUrl({ id: this._id, avatar: this.avatar });
        },
        hasFederationRight(): boolean {
            if (this.isAdmin) {
                return true;
            }
            return this.roles.includes("member") && this.roles.includes("federation");
        },
        hasPartnersRight(): boolean {
            if (this.isAdmin) {
                return true;
            }
            return this.roles.includes("member") && this.roles.includes("partnership");
        },
        hasTournamentRight(): boolean {
            if (this.isAdmin) {
                return true;
            }
            return this.roles.includes("member") && this.roles.includes("tournament");
        },
        isAdmin(): boolean {
            return this.roles.includes("admin");
        },
        isMember(): boolean {
            if (this.isAdmin) {
                return true;
            }
            return this.roles.includes("member");
        }
    },
    state: () => ({
        _id: "",
        avatar: "",
        mail: "",
        platforms: {
            discord: ""
        },
        roles: [] as Array<string>,
        student: {
            name: "",
            schoolName: ""
        },
        username: ""
    })
});
