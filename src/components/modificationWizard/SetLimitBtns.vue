<template>
    <div class="set-limit-btns">
        <div class="set-limit-btns__btns-row">
            <button 
                class="set-limit-btns__show-btn"
                @click="updateLimit(limit.value + 20)"
                v-if="rowsCount > 20 && rowsCount > limit.value"
            >Показать еще 20</button>
            <button 
                class="set-limit-btns__show-btn" 
                @click="updateLimit(rowsCount)"
                v-if="limit.value < rowsCount"
            >Показать все ({{ rowsCount - limit.value }})</button>
        </div>

        <button
            class="set-limit-btns__close-btn"
            @click="updateLimit()"
            v-if="limit.value > 10 && rowsCount >= 10"
        >Свернуть</button>
    </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
    name : "SetLimitBtns",

    props: {
        rowsCount: {
            type: Number,
            required: true,
        }
    },

    computed: {
        ...mapState({
            limit: (state) => state.limit,
        }),
    },

    methods: {
        ...mapActions({
            updateLimit: "updateLimit",
        }),
    },
}
</script>

<style lang="scss" scoped>
    .set-limit-btns {
        &__btns-row {
            margin: 30px 0 10px 0;
            display: flex;
            gap: 10px;
        }

        &__show-btn, &__close-btn {
            color: #fff;
            border: none;
            padding: 5px 15px;
            cursor: pointer;
            font-weight: 600;
        }

        &__show-btn {
            background-color: #008f86;

            @media (hover: hover) and (pointer: fine) {
                &:hover {
                    background: #fff;
                    outline: 1px solid #008f86;
                    color: #008f86;
                }
            }
        }

        &__close-btn {
            background: #4c4c4c;
            padding-right: 30px;
            position: relative;
            
            @media (hover: hover) and (pointer: fine) {
                &:hover {
                    background: #fff;
                    outline: 1px solid #4c4c4c;
                    color: #4c4c4c;

                    &::after {
                        border-bottom: 8px solid #4c4c4c;
                    }
                }
            }

            &::after {
                content: "";
                position: absolute;
                top: 4px;
                right: 10px;
                border: 5px solid transparent;
                border-bottom: 8px solid #fff;
            }
        }
    }
</style>