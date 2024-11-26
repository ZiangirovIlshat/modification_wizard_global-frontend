<template>
    <div class="modification-wizard">
        <p v-if="!products.loading && products.data.length === 0">Нет данных для отображения</p>
        <template v-else>
            <div class="modification-wizard__filters">
                <ModificationWizardFilters 
                    :data="products.data"
                    :loading="products.loading"
                    @update:vpiType="handleVpiType"
                    @update:selectedValues="handleSelectedValues"
                ></ModificationWizardFilters>
            </div>
            <div class="modification-wizard__table">
                <ModificationWizardTable
                    :data="products.data"
                    :loading="products.loading"
                    :vpiType="vpiType"
                    @update:sortedValues="handleSortedValues"
                ></ModificationWizardTable>
            </div>
        </template>
    </div>
</template>

<script>

import ModificationWizardFilters from "./modificationWizard/ModificationWizardFilters.vue";
import ModificationWizardTable from "./modificationWizard/ModificationWizardTable.vue";

export default {
    name: "ModificationWizard",

    components: {
        ModificationWizardFilters,
        ModificationWizardTable,
    },

    data() {
        return {
            requestUrl: "http://localhost/modification_wizard_global_new/backend/getData.php",

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

            vpiType: "ВПИ, МПа",
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

        handleVpiType(vpiType) {
            this.vpiType = "ВПИ, " + vpiType;
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
    // .modification-wizard {

    // }
    .modification-wizard__filters {
        background-color: #f9f9f9;
        padding: 20px;
        border-radius: 15px;
        margin: 0 0 20px 0;
    }
</style>
  