<template>
    <div class="vpi-type-selector">
        <label for="vpiTypeSelector">Единицы давления</label>
        <div class="vpi-type-selector__select-container">
            <select id="vpiTypeSelector" v-model="selectedType" @change="onChange">
                <option
                    :value="item"
                    v-for="item in vpiType.options"
                    :key="item">{{ item }}</option>
            </select>
        </div>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
    data() {
        return {
            selectedType: "",
        }
    },

    computed: {
        ...mapState({
            vpiType: (state) => state.vpiType,
        }),
    },

    methods: {
        ...mapActions({
            updateVpiType: "updateVpiType",
        }),

        onChange() {
            this.updateVpiType(this.selectedType);
        },
    },
    
    created() {
        this.selectedType = this.vpiType.value;
    },
}
</script>

<style>
.vpi-type-selector {
    display: flex;
    justify-content: space-between;
    align-items: center;
    min-width: 330px;
    width: 30%;
}
@media (max-width: 1110px) {
    .vpi-type-selector {
        width: 48%;
    }
}
@media (max-width: 768px) {
    .vpi-type-selector {
        min-width: auto;
        margin: 0 0 10px 0;
        flex-wrap: wrap;
        order: 1;
    }
    .vpi-type-selector label {
        flex: 0 0 100%;

    }
}
.vpi-type-selector select {
    width: 250px;
    height: 25px;
    background: #fff;
    border: none;
    box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.11);
    padding: 3px 25px 3px 5px;
    appearance: none;
    position: relative;
    cursor: pointer;
}
.vpi-type-selector select:focus-visible {
    outline: 1px solid;
    border: 0;
    background-color: #fff;
    color: #333;
}
@media (max-width: 1330px) {
    .vpi-type-selector select {
        width: 200px;
    }
}
.vpi-type-selector__select-container {
    position: relative;
}
.vpi-type-selector__select-container::after {
    content: "";
    position: absolute;
    top: 10px;
    right: 8px;
    pointer-events: none;
    border-style: solid;
    border-radius: 2px;
    border-width: 8px 6px 0px 6px;
    border-color: #4c4c4c transparent transparent transparent;
}

</style>