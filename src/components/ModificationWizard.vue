<template>
    <div class="modification-wizard">
        <p v-if="!products.loading && products.data.length === 0">Нет данных для отображения</p>
        <p v-else-if="products.error" v-html="products.error"></p>
        <template v-else>
            <div class="modification-wizard__filters">
                <ModificationWizardFilters 
                    :data="products.data"
                    :loading="products.loading"
                    @update:selectedValues="handleSelectedValues"
                />
            </div>

            <div class="modification-wizard__table">
                <ModificationWizardTable
                    :data="products.data"
                    :loading="products.loading"
                    @update:sortedValues="handleSortedValues"
                />
            </div>

            <SetLimitBtns
                v-if="!products.loading"
                :rowsCount="products.data.products.length"
            />
        </template>
    </div>
</template>

<script>

import ModificationWizardFilters from "./modificationWizard/ModificationWizardFilters.vue";
import ModificationWizardTable from "./modificationWizard/ModificationWizardTable.vue";
import SetLimitBtns from "./modificationWizard/SetLimitBtns.vue";

export default {
    name: "ModificationWizard",

    components: {
        ModificationWizardFilters,
        ModificationWizardTable,
        SetLimitBtns,
    },

    data() {
        return {
            requestUrl: "http://localhost/modification_wizard_global_new/backend/getData.php",
            // requestUrl: "https://owen.ru/upl_files/modules/modification_wizard_global/backend/getData.php",

            requestData: {
                "category": "",
                "sorting": {
                    "keyName" : "",
                    "orderBy" : ""
                },
                "filters": {}
            },

            products: {
                loading: "",
                error: "",
                data: {},
            },
        }
    },

    methods: {
        handleSelectedValues(selectedValues) {
            this.requestData.filters = selectedValues;
        },

        handleSortedValues(sortedValues) {
            this.requestData.sorting["keyName"] = sortedValues["keyName"];
            this.requestData.sorting["orderBy"] = sortedValues["orderBy"];
        },

        handleClearFilters() {
            this.filtersIsEmpty = true;
        },

        async getData() {
            this.products.loading = true;

            let errorText = "<b>Ошибка!</b> Что пошло не так, не удалось получить данные";

            try {
                const response = await fetch(this.requestUrl, {
                    method: "POST",
                    body: JSON.stringify(this.requestData),
                })

                if(!response.ok) {
                    this.products.error = errorText;
                    console.error("Ошибка при запросе." + response.status)
                }

                this.products.data = await response.json();

                this.products.loading = false;

            } catch (error) {
                this.products.error = errorText;
                console.error("Ошибка при запросе. \n " + error);
            } finally {
                this.products.loading = false;
            }
        },
    },

    created() {
        this.getData();
    },

    watch: {
        requestData: {
            handler(newValue, oldValue) {
                this.getData();
            },
            deep: true,
        }
    }
}

</script>
  
<style scoped lang="scss">
    b {
        font-weight: 600;
    }

    .modification-wizard {
        padding: 20px 0;

        &__filters {
            background-color: #f5f4f4;
            box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.2);
            padding: 20px;
            border-radius: 15px;
            margin: 0 0 20px 0;
        }
    }
</style>