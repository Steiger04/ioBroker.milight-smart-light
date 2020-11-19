<template>
    <q-page>
        <div class="row justify-center q-pa-md">
            <q-card
                    class="home-card"
                    :class="{'bg-grey-5': !$q.dark.isActive}"
                    flat
            >
                <q-tabs
                        v-model="formTab"
                        dense
                        :class="{'text-grey-1': !$q.dark.isActive}"
                        narrow-indicator
                        active-color="primary"
                        align="justify"
                >
                    <q-tab
                            :class="{'text-negative': !isValidBridge}"
                            name="bridgeForm"
                            :label="$t('tabs.bridge')"
                    />
                    <q-tab
                            :class="{'text-negative': !isValidZones}"
                            name="zonesForm"
                            :label="$t('tabs.zones')"
                    />
                    <q-tab
                            :class="{'text-negative': !isValidApp}"
                            name="appForm"
                            :label="$t('tabs.app')"
                    />
                </q-tabs>

                <q-separator/>

                <q-tab-panels
                        :class="{'pannels': !$q.dark.isActive}"
                        v-model="formTab"
                        animated
                >
                    <q-tab-panel name="bridgeForm">
                        <bridge-form/>
                    </q-tab-panel>

                    <q-tab-panel name="zonesForm">
                        <zones-form/>
                    </q-tab-panel>

                    <q-tab-panel name="appForm">
                        <app-form/>
                    </q-tab-panel>
                </q-tab-panels>
            </q-card>
        </div>
    </q-page>
</template>

<script>
import { fieldsTemplate } from '../mixin/fieldsTemplate';
import BridgeForm from '../components/BridgeForm';
import AppForm from '../components/AppForm';
import ZonesForm from '../components/ZonesForm';

export default {
    name: 'Home',
    components: {
        AppForm,
        BridgeForm,
        ZonesForm,
    },
    mixins: [fieldsTemplate],
    data() {
        return {
            formTab: 'bridgeForm',
        };
    },
};
</script>

<style
        lang="sass"
        scoped
>
.home-card
  width: 100%

.pannels
  background: #efefef
</style>
