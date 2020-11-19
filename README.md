![Logo](public/milight-smart-light-logo.png)
# ioBroker.template-vue
[![Dependency Status](https://img.shields.io/david/Steiger04/iobroker.template-vue.svg)](https://david-dm.org/Steiger04/iobroker.template-vue)

## template-vue adapter for ioBroker
The template integrates Quasar with Vuex, a Vue.js-based framework and enables the simple and efficient development
of adapter administration. 

## Developer manual
### Perform the following steps in sequence:
1. Install Quasar
   ```
   npm install -g @quasar/cli
   ```

2. Clone github repo into your **_Development Folder_**
   ```
   git clone https://github.com/Steiger04/ioBroker.template-vue.git
   ```
3. npm install and eslint
   ```
   cd ioBroker.template-vue
   npm install   
   ./node_modules/.bin/eslint --fix --ext .js,.vue ./
   ```
4. Rename ioBroker.template-vue to iobroker.template-vue
5. npm link in iobroker.template-vue
   ```   
   cd iobroker.template-vue
   npm link
   ```
6. npm link in iobroker/node-modules
   ```   
   cd iobroker/node-modules
   npm link iobroker.template-vue   
   ```

## Getting started
#### Start development server
 ```   
 cd iobroker.template-vue
 quasar dev  
 ```
#### Build admin
 ```   
 cd iobroker.template-vue
 quasar build
 ```
The admin folder is created in the iobroker.template-vue folder.

**Now remember to do an upload.**
 ```   
 cd iobroker
 iobroker upload template-vue
 ```
## Best Practices
All native properties are provided reactively in the Vuex store, including the necessary getters and
mutations. The following native sample object is used in the template:
```
"native": {
    "option1": false,
    "option2": "50",
    "adressen": [
      {
        "plz": 50259,
        "stadt": "Köln",
        "strasse": "Melchiorstraße",
        "hausnummer": 3
      },
      {
        "plz": 60327,
        "stadt": "Frankfurt am Main",
        "strasse": "Ludwig-Erhard-Anlage",
        "hausnummer": 1
      },
      {
        "plz": 80336,
        "stadt": "München",
        "strasse": "Schillerstraße",
        "hausnummer": 9
      }
    ]
  }
```
In the Home.vue file option1 and option2 are made available as computed property and can be used
immediately by all Quasar components in the template section.

``` javascript
<script>
import { mapFields } from 'vuex-map-fields';
import { fieldsTemplate } from '../mixin/fieldsTemplate';

export default {
    name: 'Home',
    mixins: [fieldsTemplate],
    data() {
        return {
            /* myNotStoreData1: '' */
        };
    },
    computed: {
        ...mapFields('template', {
            option1: 'native.option1',
            option2: 'native.option2',
        }),
    },
};
</script>
```
If the native object in io-package.json is extended by an option3, only the following needs
to be added to mapFields in Home.vue:
``` javascript
    computed: {
        ...mapFields('template', {
            option1: 'native.option1',
            option2: 'native.option2',
            option3: 'native.option3',
        }),
    },
};
```
That's all!
## Changelog

### 1.0.0
* (Steiger04) initial release

## License
MIT License

Copyright (c) 2020 Steiger04 <steiger04@posteo.de>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
