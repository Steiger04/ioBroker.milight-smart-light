<template>
  <q-card
      class="zone-form"
      :class="{'bg-grey-4': !$q.dark.isActive}"
  >
    <q-card-section>
      <q-table
          class="sticky-header"
          :class="{'bg-grey-4': !$q.dark.isActive}"
          dense
          hide-pagination
          :rows-per-page-options="[0]"
          :no-data-label="$t('zonesForm.nodata')"
          separator="none"
          flat
          title="Zonen"
          row-key="name"
          :columns="dynColumns"
          :data="tableZones"
      >
        <template v-slot:top>
          <q-btn
              :disable="isMaxZones"
              icon="add"
              color="primary"
              @click="addZone($v.zones.$touch)"
          />
        </template>

        <template v-slot:header-cell="props">
          <q-th :props="props">
                        <span class="text-primary text-body1 text-weight-bolder">
                            {{ props.col.label }}
                        </span>
          </q-th>
        </template>

        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td
                key="zoneActive"
                :props="props"
            >
              <q-toggle
                  v-model="props.row.$model.mslZoneActive"
                  checked-icon="check"
                  color="green"
                  unchecked-icon="clear"
              />
            </q-td>

            <q-td
                key="zoneNumber"
                :props="props"
            >
              <q-select
                  transition-show="scale"
                  transition-hide="scale"
                  item-aligned
                  dense
                  filled
                  borderless
                  emit-value
                  map-options
                  v-model="props.row.$model.mslZoneNumber"
                  :error="props.row.mslZoneNumber.$error"
                  :options="zoneNumberOptions"
              />
            </q-td>

            <q-td
                key="groupName"
                :props="props"
            >
              <q-input
                  item-aligned
                  filled
                  dense
                  bottom-slots
                  v-model="props.row.$model.mslGroupName"
                  :error="props.row.mslGroupName.$error"
              />
            </q-td>

            <q-td
                key="zoneType"
                :props="props"
            >
              <q-select
                  transition-show="scale"
                  transition-hide="scale"
                  item-aligned
                  dense
                  filled
                  borderless
                  emit-value
                  map-options
                  v-model="props.row.$model.mslZoneType"
                  :error="props.row.mslZoneType.$error"
                  :options="zoneTypeOptions"
              />
            </q-td>

            <q-td
                key="colorOffset"
                :props="props"
            >
              <q-input
                  item-aligned
                  dense
                  filled
                  v-model="props.row.$model.mslColorOffset"
                  :error="props.row.mslColorOffset.$error"
                  :disable="!isColorOffset(props.row.$model)"
                  :placeholder="isColorOffset(props.row.$model) ? '' : '-x-x-x-'"
              />
            </q-td>

            <q-td
                key="zoneName"
                :props="props"
            >
              <q-input
                  item-aligned
                  dense
                  filled
                  v-model="props.row.$model.mslZoneName"
                  :error="props.row.mslZoneName.$error"
              />
            </q-td>

            <q-td
                key="room"
                :props="props"
            >
              <q-select
                  transition-show="scale"
                  transition-hide="scale"
                  dense
                  filled
                  borderless
                  emit-value
                  map-options
                  v-model="props.row.$model.mslRoom"
                  :options="roomOptions"
              />
            </q-td>

            <q-td
                key="func"
                :props="props"
            >
              <q-select
                  transition-show="scale"
                  transition-hide="scale"
                  dense
                  filled
                  use-chips
                  borderless
                  emit-value
                  map-options
                  multiple
                  :value="props.row.$model.mslFunc"
                  @input="props.row.$model.mslFunc=$event.sort()"
                  :options="funcOptions"
              />
            </q-td>

            <q-td
                key="delete"
                :props="props"
            >
              <q-btn
                  size="sm"
                  icon="delete_forever"
                  round
                  color="negative"
                  @click="deleteZone(props.row.$model.id)"
              />
            </q-td>
          </q-tr>
        </template>

        <template
            v-if="isErrorMessages"
            v-slot:bottom
        >
          <div class="row q-pt-sm">
            <q-chip
                v-for="(val, name, idx) in errorMessages"
                :key="idx"
                dense
                color="red-4"
                text-color="grey-1"
            >
              <q-avatar
                  color="negative"
                  text-color="white"
              >
                {{ val }}
              </q-avatar>
              {{ name }}
            </q-chip>
          </div>
        </template>

        <template v-slot:no-data="{ icon, message }">
          <div class="full-width row flex-center text-negative text-weight-bolder q-pt-md">
            <q-icon
                size="2em"
                name="sentiment_dissatisfied"
            />
            <span>{{ message }}</span>
          </div>
        </template>
      </q-table>
    </q-card-section>
  </q-card>
</template>

<script>
import { mapMultiRowFields } from 'vuex-map-fields';
import { mapActions } from 'vuex';
import { required } from 'vuelidate/lib/validators';
import { validationMessage } from 'vuelidate-messages';
import {
  isunique, defaultColorOffset, isAllowedZoneType, isAllowedZoneNumber, regexColorOffset, regexGroupAndName,
} from '../js/vuelidate-custom-validators';
import { fieldsTemplate } from '../mixin/fieldsTemplate';
import { messages } from '../js/vuelidate-messages';

export default {
  name: 'ZonesForm',
  mixins: [fieldsTemplate],
  data() {
    return {
      columns: [
        {
          name: 'zoneActive',
          label: this.$t('zonesForm.thactive'),
          field: '$model.mslZoneActive',
          align: 'center',
        },
        {
          name: 'zoneNumber',
          label: this.$t('zonesForm.thzonenumber'),
          field: '$model.mslZoneNumber',
          align: 'center',
        },
        {
          name: 'groupName',
          label: this.$t('zonesForm.thgroupname'),
          field: '$model.mslGroupName',
          sortable: true,
          align: 'center',
        },
        {
          name: 'zoneType',
          label: this.$t('zonesForm.thzonetype'),
          field: '$model.mslZoneType',
          sortable: true,
          align: 'center',
        },
        {
          name: 'colorOffset',
          label: this.$t('zonesForm.thcoloroffset'),
          field: '$model.mslColorOffset',
          align: 'center',
        },
        {
          name: 'zoneName',
          label: this.$t('zonesForm.thzonename'),
          field: '$model.mslZoneName',
          sortable: true,
          align: 'center',
        },
        {
          name: 'room',
          label: this.$t('zonesForm.throom'),
          field: '$model.mslRoom',
          sortable: true,
          align: 'center',
        },
        {
          name: 'func',
          label: this.$t('zonesForm.thfunction'),
          field: '$model.mslFunc',
          align: 'center',
        },
        {
          name: 'delete',
          align: 'center',
        },
      ],
    };
  },
  computed: {
    ...mapMultiRowFields('template', { zones: 'native.zones' }),
    errorMessages() {
      const errors = [];
      const errorCounts = {};

      this.tableZones.forEach((zone) => {
        if (zone.mslZoneNumber && zone.mslZoneNumber.$error) {
          errors.push(this.validationMsg(zone.mslZoneNumber, this.$t('zonesForm.thzonenumber')));
        }
        if (zone.mslGroupName && zone.mslGroupName.$error) {
          errors.push(this.validationMsg(zone.mslGroupName, this.$t('zonesForm.thgroupname')));
        }
        if (zone.mslZoneType && zone.mslZoneType.$error) {
          errors.push(this.validationMsg(zone.mslZoneType, this.$t('zonesForm.thzonetype')));
        }
        if (zone.mslColorOffset && zone.mslColorOffset.$error) {
          errors.push(this.validationMsg(zone.mslColorOffset, this.$t('zonesForm.thcoloroffset')));
        }
        if (zone.mslZoneName && zone.mslZoneName.$error) {
          errors.push(this.validationMsg(zone.mslZoneName, this.$t('zonesForm.thzonename')));
        }
      });

      errors.forEach((message) => { errorCounts[message] = (errorCounts[message] || 0) + 1; });

      return errorCounts;
    },
    isErrorMessages() {
      return Object.keys(this.errorMessages).length;
    },
    isColorOffset: () => ($model) => ($model.mslZoneType === 'fullColor' || $model.mslZoneType
      === 'fullColor8Zone'),
    isMaxZones() {
      return this.zoneNumberOptions.length === this.zones.length;
    },
    tableZones() {
      return Object.values(this.$v.zones.$each.$iter)
        .map((zone) => zone);
    },
    dynColumns() {
      if (this.controllerType === 'legacy') {
        return this.columns.filter((col) => col.name !== 'colorOffset');
      }
      return this.columns;
    },
    zoneNumberOptions() {
      const zoneNumbers = [
        {
          label: this.$t('zonesForm.zone1'),
          value: '1',
        },
        {
          label: this.$t('zonesForm.zone2'),
          value: '2',
        },
        {
          label: this.$t('zonesForm.zone3'),
          value: '3',
        },
        {
          label: this.$t('zonesForm.zone4'),
          value: '4',
        },
        {
          label: this.$t('zonesForm.zone5'),
          value: '5',
        },
        {
          label: this.$t('zonesForm.zone6'),
          value: '6',
        },
        {
          label: this.$t('zonesForm.zone7'),
          value: '7',
        },
        {
          label: this.$t('zonesForm.zone8'),
          value: '8',
        },
        {
          label: this.$t('zonesForm.zone9'),
          value: '9',
        },
      ];

      if (this.controllerType === 'v6') {
        if (this.iBox === 'iBox1') {
          if (this.maxZones === '4') {
            zoneNumbers.length = 5;
          } else {
            zoneNumbers.length = 9;
          }
        } else if (this.maxZones === '4') {
          zoneNumbers.length = 4;
        } else {
          zoneNumbers.length = 8;
        }
      } else { // controllerType: legacy
        zoneNumbers.length = 4;
      }

      return zoneNumbers;
    },
    zoneTypeOptions() {
      const zoneTypes = [
        {
          label: this.$t('zonesForm.white'),
          value: 'white',
        },
        {
          label: this.$t('zonesForm.rgbw'),
          value: 'rgbw',
        },
        {
          label: this.$t('zonesForm.fullColor'),
          value: 'fullColor',
        },
        {
          label: this.$t('zonesForm.fullColor8Zone'),
          value: 'fullColor8Zone',
        },
        {
          label: this.$t('zonesForm.bridge'),
          value: 'bridge',
        },
      ];

      if (this.controllerType === 'v6') {
        if (this.iBox === 'iBox1') {
          return zoneTypes;
        }
        zoneTypes.length = 4;
        return zoneTypes;
      }

      zoneTypes.length = 2;
      return zoneTypes;
    },
  },
  methods: {
    validationMsg: validationMessage(messages),
    ...mapActions('template', ['addZone', 'deleteZone']),
  },
  watch: {
    '$v.$anyError': function (val) {
      this.isValidZones = !val;
    },
  },
  validations: {
    zones: {
      $each: {
        mslZoneNumber: {
          required,
          isAllowedZoneNumber,
          isunique,
        },
        mslGroupName: {
          required,
          regexGroupAndName,
        },
        mslZoneType: {
          required,
          defaultColorOffset,
          isAllowedZoneType,
        },
        mslColorOffset: {
          regexColorOffset,
        },
        mslZoneName: {
          regexGroupAndName,
        },
      },
    },
  },
  created() {
    this.$v.$touch();
  },
};
</script>

<style
    lang="sass"
    scoped
>
.zone-form
  width: 100%

.sticky-header
  /* height or max-height is important */
  max-height: 500px

  .q-table__top,
  .q-table__bottom,
  thead tr:first-child th
    /* bg color is important for th; just specify one */
    background-color: $grey-5

  thead tr th
    position: sticky
    z-index: 1

  thead tr:first-child th
    top: 0

  /* this is when the loading indicator appears */
  &.q-table--loading thead tr:last-child th
    /* height of all previous header rows */
    top: 48px
</style>
