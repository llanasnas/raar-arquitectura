---
slug: /contact
original_file: contact.html
title_original: "Works"
meta_description_original: "description"
nav_label: "04 : Contact us"
heading: "04 : Contact us"
phone: "+34 93 488 02 56"
email: "arquitectura@raar-arquitectura.eu"
address: "C/ Bruc 136 bajos 2a, Barcelona"
map: false
opening_hours: null
form:
  action_original: send_email.php
  fields_original: [email, subject, message]
  submit_label_original: "Send"
  works: false
social_heading: "Follow us on social media"
social:
  - { network: facebook,  url: "http://www.facebook.com",                    valid: false }
  - { network: instagram, url: "https://www.instagram.com/raar.arquitectura/", valid: true }
  - { network: linkedin,  url: "http://www.linkedin.com",                    valid: false }
---

# Contact us — contenido íntegro de la página original

## Layout

Dos columnas:

- **Izquierda (col-md-7):** formulario `email`, `subject`, `textarea` (placeholder "Enter your message"), botón `Send`.
- **Derecha (col-md-5):** lista con icono teléfono / arroba / marcador + bloque "Follow us on social media" con iconos Facebook, Instagram, LinkedIn.

## Texto visible

```
+ 34 93 488 02 56
arquitectura@raar-arquitectura.eu
C/ Bruc 136 bajos 2a, Barcelona

Follow us on social media
```

## Problemas detectados

- Los `<input>` no tienen atributo `name` → el POST llega vacío; el formulario **no funciona** funcionalmente.
- `send_email.php` en un hosting estático — probablemente inexistente.
- Sin campo nombre, teléfono, tipo de proyecto, presupuesto ni checkbox de privacidad (RGPD).
- Sin mapa, sin horario, sin código postal, sin indicación de cómo llegar.
- Facebook y LinkedIn apuntan a la home genérica de cada red (placeholders de plantilla).
- El teléfono no es un enlace `tel:`; el email no es `mailto:`.
- Sin mensaje de confirmación/éxito ni validación.
