const CACHE_NAME =
    "mi-agenda-dental-v2";

const FILES_TO_CACHE = [

    "./",

    "./index.html",

    "./style.css",

    "./app.js",

    "./manifest.json"

];


self.addEventListener(
    "install",
    event => {

        event.waitUntil(

            caches
                .open(
                    CACHE_NAME
                )
                .then(
                    cache => {

                        return cache.addAll(
                            FILES_TO_CACHE
                        );

                    }
                )

        );

    }
);


self.addEventListener(
    "activate",
    event => {

        event.waitUntil(

            caches
                .keys()
                .then(
                    keys => {

                        return Promise.all(

                            keys
                                .filter(
                                    key =>
                                        key !==
                                        CACHE_NAME
                                )
                                .map(
                                    key =>
                                        caches.delete(
                                            key
                                        )
                                )

                        );

                    }
                )

        );

    }
);


self.addEventListener(
    "fetch",
    event => {

        event.respondWith(

            caches
                .match(
                    event.request
                )
                .then(
                    response => {

                        return (
                            response ||
                            fetch(
                                event.request
                            )
                        );

                    }
                )

        );

    }
);


/* =========================================
   NOTIFICACIONES PUSH
========================================= */

self.addEventListener(
    "push",
    event => {

        let data = {};

        try {

            data = event.data
                ? event.data.json()
                : {};

        } catch (error) {

            data = {
                title: "Mi Agenda Dental",
                body: event.data
                    ? event.data.text()
                    : "Tienes un nuevo aviso."
            };

        }


        const title =
            data.title ||
            "Mi Agenda Dental";


        const options = {

            body:
                data.body ||
                "Tienes un nuevo aviso de tu agenda.",

            icon:
                data.icon ||
                "./icon-192.png",

            badge:
                data.badge ||
                "./icon-192.png",

            data: {

                url:
                    data.url ||
                    "./"

            }

        };


        event.waitUntil(

            self.registration
                .showNotification(
                    title,
                    options
                )

        );

    }
);


/* =========================================
   AL PULSAR LA NOTIFICACIÓN
========================================= */

self.addEventListener(
    "notificationclick",
    event => {

        event.notification.close();


        const url =
            event.notification.data &&
            event.notification.data.url
                ? event.notification.data.url
                : "./";


        event.waitUntil(

            clients
                .matchAll({
                    type: "window",
                    includeUncontrolled: true
                })
                .then(
                    windowClients => {

                        for (
                            const client
                            of windowClients
                        ) {

                            if (
                                "focus"
                                in client
                            ) {

                                client.focus();

                                return;
                            }

                        }


                        if (
                            clients.openWindow
                        ) {

                            return clients.openWindow(
                                url
                            );

                        }

                    }
                )

        );

    }
);