"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MeetingManager_1 = __importDefault(require("../MeetingManager"));
class TestableMeetingContext {
    getAll() {
        return new Promise((resolve) => {
            resolve([
                {
                    uuid: "123",
                    start_url: "the place to be",
                    topic: "interesting thing",
                },
            ]);
        });
    }
    get(uuid) {
        return new Promise((resolve) => {
            resolve({
                uuid: uuid,
                start_url: "the place to be",
                topic: "interesting thing",
            });
        });
    }
    post(item) {
        return new Promise((resolve) => { resolve(item); });
    }
    delete(id) {
        throw new Error("Method not implemented.");
    }
    put(item) {
        throw new Error("Method not implemented.");
    }
}
const context = new TestableMeetingContext();
const manager = new MeetingManager_1.default(context);
test("can add meetings from zoom payload", () => __awaiter(void 0, void 0, void 0, function* () {
    yield manager.addMeeting({
        uuid: "JtcANK6eSaWGRSAgN8xg+Q==",
        id: 93398173560,
        host_id: "eyxXfnupQvWNjXJcNoD7Xg",
        host_email: "david@federnet.com",
        topic: "CASpR Support",
        start_url: "https://zoom.us/s/93398173560?zak=eyJ6bV9za20iOiJ6bV9vMm0iLCJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJjbGllbnQiLCJ1aWQiOiJleXhYZm51cFF2V05qWEpjTm9EN1hnIiwiaXNzIjoid2ViIiwic3R5IjoxLCJ3Y2QiOiJhdzEiLCJjbHQiOjAsInN0ayI6InQ5NUNKWG1rcHo0U0lkMV9aUndTOUduZElhdlNMRGtja3U5aFh2LVcwbUEuQUcuTTFxWFcxc3d0Zmw2TWFQR21hVHczWnU0V0I5Vmt3S1hoc3h5Uk1telplVFBaeXBZMk9lY0RzblpUclJqREMxWExubTJTeFk5djNHS0NwNC5KTGFBZWNkcjJIZ2N6TVFyMllvNE9BLk44bnJubEhSVlA0OFROTVQiLCJleHAiOjE2MDcyMDg0NzgsImlhdCI6MTYwNzIwMTI3OCwiYWlkIjoidV96UmVSbWhSWWlLY0U2dzdhQVpoZyIsImNpZCI6IiJ9.NXPpvZRL80AVFMVyqaXhKO1hKywkFbYyze48LtOxTWw",
        join_url: "https://zoom.us/j/93398173560?pwd=c2dnaFMzTzkvSmgzZnhaUVZYb2lwdz09",
        password: "u4UrGs",
    });
    let meetings = yield manager.getAll();
    expect(meetings.length).toBeGreaterThan(0);
}));
test("can find a meeting by uuid", () => __awaiter(void 0, void 0, void 0, function* () {
    let meeting = yield manager.getMeeting("JtcANK6eSaWGRSAgN8xg+Q==");
    expect(meeting).toBeDefined();
    expect(meeting.start_url).toEqual("the place to be");
}));
test("can get all meetings", () => __awaiter(void 0, void 0, void 0, function* () {
    let meetings = yield manager.getAll();
    expect(meetings.length).toBeGreaterThan(0);
    expect(meetings[0].uuid).toEqual("123");
}));
