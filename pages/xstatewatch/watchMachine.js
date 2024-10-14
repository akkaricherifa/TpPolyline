import { createMachine, assign } from "xstate";
import { DateTime, Duration } from "luxon";

export const watchMachine = createMachine({
    /** @xstate-layout N4IgpgJg5mDOIC5QBECWVUBcCGAbA6tpgMYAWAxAMIAyA8pQNIAqAkowNoAMAuoqAA4B7WFlSCAdnxAAPRAE4AzJwB0AFgBsC9QEYAHAHYATPv2rd6gDQgAnom2GAvg6toMOAkTLKAcoIBOALZ4ALKCEGDKaLD8uNjW5ACqAApcvEggQiKYYpLpsgjaqtoKypzaAKzq+rrmCnKccvpWtgWcbaX6ZXKqnLrlWuWOziCuWHiEJKQ+-kG4oeGRqNGx1spMqAFg5ACiAMqUqVKZohJS+eUXyuoa14NGCuUVzYj6crrK+uWqCqZ6xuZOFzoMYeSbTQIhMIRKIxOJrDZbXbbJiHdLHbKnPJ2ezPAr1dTKBSFXSqQxaBrqAyAkbA9wTLy+CFzKGLZZw5BELZ7A48I7CE65UDnPrKOTlfEXH7adScJo2RDqdSGNSffRKBQGPSqcrU0Z0zxTRmzebQpaw1YczCI5GogT8jGCmR2TiGXGPbTKR6cIqGQzaEyGWW62njA3g40smErSKc8jSWA4K3KbAAMytfgAFOU2pwAJTkPWhsFGyELKPszm2jL2nJnRAXcpXG7a4xkx7lXH6eyiuqthRFHRVYNuIsMmal01s1YAQVigR2+yr6NrWIQRP0yjbgf01yq2e9nd0JW32eK1x6nB1w0LoLHTJNrPNyln2HnSJRvLRNcxQudrvleKVB81Qat8FQXvow4gvShrjsyZZmtGL7zvGiYRKm6ZZjm+Y3jB4YTo+SFzgES7fo6+TrpuDzbrunxtKouJHiUVTaN6ChEjUCjGFB+rFnBD7rJsfjKLsmCCPw-CQIkKSfnaWQrr+CAALTMUUqhyPYZSUvYZi4qxO7KFq7GGIoPRiqoPGjrB94soJYDCaJ4mSRA5DvqR8k-k6ykVB6SpceUnzisSLp6b0BJmPY9QVPUhi6JZt7WRGCx2Q5YkSVJqGcsmab2RmrHYQWIYJfh8ERClIlpc57kCnWBSkiUZSVNUtT1I0emVASdT9Ox2i9fYnzxXhJalfCQnKAA4oIqDiFA0nVQ6tUqU2hQaYG0q6DpuihYYjZGLK6j7lqeiDWGw0CQiwmTdNs2ZUmGG5fleaFSOxVnbZF0TVNM3zQpXm6Mq7HZqYbxdnochyLibwer1B3ioOGlyOoJ18TZCyUKQ2AzWAdnKOjmMwAAEoIACufiuTasnVh55HYkSpSmT0uiI3IxgQwBhT9IZiMBfU6mDKSyN3klER41jOOi4TJNk8kP2efkbwqHUnBEhp5TmAdbMtIUmhqKZ-Z3G8ciC4lBES9jCK4xjWNE6TcYJll92ZvuT24ad-Esmb4tW5LpOyzTCAyu8sW80YujeqoJh6V2Khiuo+KNMY9HGyVD6exbZvBNNxNWrA5Mfmkck1auvV0w0-aM8zrN6T0ypqkoVQ1xcQbXkVQ3u2j3vm5slv42AmfiNncBzZTy5y3YbaEgFpjZkebT9HpDyNvYrFcYoavK0MQIvW3qMi53Xu9-3g+57d6E5U7BWuyjws92L6ed0fOd+7Vgebkz3qh+Hkfs0FHzL8rzVV7Jzeh3Xulo96HwkJgCgbkR5kVqn1d4nFrhHn6J0GouJFSqFKLKWKLpVDag4sA9uECsbgNvjAUI4hoHDwLlTIuikxQblQRHOo-0dyWAAhcZUFxFAGF+OpJGLdt5u13hQsA5CM5QIoKfbKmFnY4VbqIm+ZtJEP2kc-VcPNDIGDMOvUkO0GIAUpMqcG-Y1QbV9GYOKwjoLKNNp3NRYC4h500YpRByhkFmAeD8XoW1jHFE9N8CxJk2jgxsVvOx18HHOKTKolxMs4HUwQX6OQHw+aym6BqfEboDo9n9OeDUhg44KGIWI+JcTHEuNkY7LCbRFEiOiSNCppCYAcmsG4ry2i9CmD6GHAxXxIbekJG0HcoETJfCNrY3iQsYlY2QgEcRNsyawLoaPf2fUAa9F6vcbhBhQq9E9L0RQXEXQHS0GUlRncFlLKlrQvkyTVyNGhpSV4Xx+hKh2qFPQnjLxHm0I0XprxLlzJgDcs2yy7ZoTkblBRz0omzOadc4itzfZJIYV0t4b96gbQ0p8b4-4tb9hKJKWKVQZRtGuCCpFvdwUPyzjnVx6KFrF16lsja-o2yDH2QBMU7xvRfD9A2Sk1LU7ItfIsjODKh6JLWfA4uE9pRKh2RqVi2pIasTUOxOoDwmI1E3jSRpiKxW0pRVKgejKannzqS7JRTSTXzLNfSi1cBOnnCxcHbZeKvhcT0lYkZfRiicTLhZaZVlnzEShQ7a1cKr5eAWW6uw3wPhHj6GKAFxSTIKD0keT0asp4QV5leYY4goTwHSHG0gDyMX5CUhMq4ZIdqBQ0rpXljZOBKjMLzB49Q1SiqhNWllik60Rwbf5ZtwVCWIHVISAl2pBjSjeAaytKdIyITiIO36+QKgbm1MUCKxgzByhaNqAkatpRKH9J0Hp-aEJTlGmATdY8EAaBUI8W4LMOaDC0J2RG6TigBUij2iJhqEUmxGuWC0nIn3+3QaKf4iMSSNSMS0L42CO29DKGxTQRhb2TifAsmDtVAyNj3f2SxQLDzYJ9QQgF-pWImTww+vwRHVxKQBWkvyTbeGTsYooK4PxewunBoqZddrjXvTGo5dKEBWPDsKIrcGJkJlMI2pwrWPSgk-BqBpPQ1xSlhteiQ5jn1rpya8izQygZfRjI5oQ0KrxDJdlihcNUfpehMfKp5dZi0dJqD2WHOOBC+HbQ3ODf0BCeiDBdExvwYBMCk3EAAfQAO6kHsmAJL1gSapYy+Z7dpJDKCL0JUL4TN1PTvqJ4qxxRWLmHbExtOmx8vyF9ISAMgKbNGE1uPKoy1zDbN3CSRr+97692WS1hAjRFYdYDMYbr7Vrh5vFMZMO-1Bgjd7gfLGj84CTfsG114eKDEK20NXICegfHrRaleSJMzwMOradBr8jzFJM3eEFRoR4NJYf8SevJmHfRvBwzUUNd3w0gNaRIrKUjqFVpezW+QGhPQIxAj9urmDObKvMN66oEdNtkJh1Ulohch1eX-p6JmqrKQHX+pgxUopujFJVr1P5BOwXEUm-UElqOeg6EE39xA-1TGCr9BoKLFzDM7yuaaiVqKWMI7J-LR4KOAWmA7cUCxeleppPMExWU6pDBg9A-d1doDHVy-NcffbgZ0NBuzJUJDU7Wi9V1uKAhJk9MmCY95+V7icTs2qBuVzehkMI2ToRxXW7EARxzTwgcHUlBoeVk4JwQA */
    context: {
        alarmTime: DateTime.now().plus({ minutes: 2 }),
        currentTime: DateTime.now(),
        timer: Duration.fromObject({ hours: 0, minutes: 0, seconds: 0 }),
    },
    id: "DigitalWatch",
    initial: "NormalMode",
    on: {
        CLOCKTICK: {
            actions: assign({
                currentTime: (context, event) => {
                    console.log("CLOCKTICK");
                    return context.currentTime.plus({ seconds: 1 });
                },
            }),
        },
    },
    states: {
        NormalMode: {
            initial: "Display",
            states: {
                Display: {
                    initial: "Time",
                    states: {
                        Time: {
                            on: {
                                ESC: {
                                    target: "Date",
                                },
                                SET: {
                                    target: "#DigitalWatch.NormalMode.ChangeTime",
                                },
                            },
                        },
                        Date: {
                            after: {
                                5000: {
                                    target: "#DigitalWatch.NormalMode.Display.Time",
                                },
                            },
                            on: {
                                ESC: {
                                    target: "Alarm",
                                },
                                SET: {
                                    target: "#DigitalWatch.NormalMode.ChangeDate",
                                },
                            },
                        },
                        Alarm: {
                            after: {
                                5000: {
                                    target: "#DigitalWatch.NormalMode.Display.Time",
                                },
                            },
                            on: {
                                ESC: {
                                    target: "Time",
                                },
                                SET: {
                                    target: "#DigitalWatch.NormalMode.ChangeAlarm",
                                },
                            },
                        },
                    },
                    on: {
                        UP: {
                            target: "Timer",
                        },
                    },
                },
                Timer: {
                    initial: "Stopped",
                    states: {
                        Stopped: {
                            after: {
                                10000: {
                                    target: "#DigitalWatch.NormalMode.Display",
                                },
                            },
                            on: {
                                UP: {
                                    target: "Going",
                                },
                                SET: {
                                    actions: assign({
                                        timer: (context, event) => {
                                            console.log("resetting timer");
                                            return Duration.fromObject({
                                                hours: 0,
                                                minutes: 0,
                                                seconds: 0,
                                            });
                                        },
                                    }),
                                },
                            },
                        },
                        Going: {
                            on: {
                                UP: {
                                    target: "Stopped",
                                },
                            },
                            after: {
                                1000: {
                                    target: "Going",
                                    actions: assign({
                                        timer: (context, event) => {
                                            console.log("updating Timer seconds");
                                            return context.timer.plus({ seconds: 1 });
                                        },
                                    }),
                                    internal: false,
                                },
                            },
                        },
                        on: {
                            ESC: {
                                target: "Display",
                            },
                        },
                    },                   
                },
                return_where_you_were: {
                    history: "deep",
                    type: "history",
                },
                ChangeTime: {
                    initial: "ChangeHour",
                    states: {
                        ChangeHour: {
                            after: {
                                5000: {
                                    target: "#DigitalWatch.NormalMode.Display.Time",
                                },
                            },
                            on: {
                                SET: {
                                    target: "ChangeMinutes",
                                },
                                UP: {
                                    target: "ChangeHour",
                                    internal: false,
                                    actions: assign({
                                        currentTime: (context, event) => {
                                            console.log("updating Hour");
                                            return context.currentTime.plus({hours: 1});
                                        },
                                    }),
                                },
                            },
                        },
                        ChangeMinutes: {
                            after: {
                                5000: {
                                    target: "#DigitalWatch.NormalMode.Display.Time",
                                },
                            },
                            on: {
                                SET: {
                                    target: "ChangeHour",
                                },
                                UP: {
                                    target: "ChangeMinutes",
                                    internal: false,
                                    actions: assign({
                                        currentTime: (context, event) => {
                                            console.log("updating Minutes");
                                            return context.currentTime.plus({
                                                minutes: 1,
                                            });
                                        },
                                    }),
                                },
                            },
                        },
                    },
                },
                ChangeDate: {
                    initial: "ChangeMonth",
                    states: {
                        ChangeMonth: {
                            after: {
                                5000: {
                                    target: "#DigitalWatch.NormalMode.Display.Date",
                                },
                            },
                            on: {
                                SET: {
                                    target: "ChangeDay",
                                },
                                UP: {
                                    target: "ChangeMonth",
                                    internal: false,
                                    actions: assign({
                                        currentTime: (context, event) => {
                                            console.log("updating Month");
                                            return context.currentTime.plus({months: 1});
                                        },
                                    }),
                                },
                            },
                        },
                        ChangeDay: {
                            after: {
                                5000: {
                                    target: "#DigitalWatch.NormalMode.Display.Date",
                                },
                            },
                            on: {
                                SET: {
                                    target: "ChangeMonth",
                                },
                                UP: {
                                    target: "ChangeDay",
                                    internal: false,
                                    actions: assign({
                                        currentTime: (context, event) => {
                                            console.log("updating Day");
                                            return context.currentTime.plus({days: 1});
                                        },
                                    }),
                                },
                            },
                        },
                    },
                },
                ChangeAlarm: {
                    initial: "ChangeHour",
                    states: {
                        ChangeHour: {
                            after: {
                                5000: {
                                    target: "#DigitalWatch.NormalMode.Display.Alarm",
                                },
                            },
                            on: {
                                SET: {
                                    target: "ChangeMinutes",
                                },
                                UP: {
                                    target: "ChangeHour",
                                    internal: false,
                                    actions: assign({
                                        alarmTime: (context, event) => {
                                            console.log("updating Alarm hour");
                                            return context.alarmTime.plus({hours: 1});
                                        },
                                    }),
                                },
                            },
                        },
                        ChangeMinutes: {
                            after: {
                                5000: {
                                    target: "#DigitalWatch.NormalMode.Display.Alarm",
                                },
                            },
                            on: {
                                SET: {
                                    target: "ChangeHour",
                                },
                                UP: {
                                    target: "ChangeMinutes",
                                    internal: false,
                                    actions: assign({
                                        alarmTime: (context, event) => {
                                            console.log("updating Timer minutes");
                                            return context.alarmTime.plus({ minutes: 1});
                                        },
                                    }),
                                },
                            },
                        },
                    },
                },                
            },
            on: {
                AlarmTime: {
                    target: "#DigitalWatch.Alarm",
                },
            },
        },
        Alarm: {
            after: {
                5000: {
                    target: "#DigitalWatch.NormalMode.return_where_you_were",
                },
            },
        },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
    services: {},
    guards: {},
    delays: {},
});
