<template>
    <li>
        <input type="text" v-model="question.text" @blur="update" />
        <button @click="remove">Supprimer</button>
    </li>
</template>

<script>
export default {
    name: "QuestionItem",
    props: {
        question: Object,
    },
    methods: {
        // Émet l'événement de mise à jour vers le composant parent
        update() {
        this.$emit("update-question", this.question);
        },
        // Émet l'événement de suppression vers le composant parent
        remove() {
        this.$emit("remove-question", this.question.id);
        },
    },
};
</script>

<style scoped>
    li {
    margin-bottom: 5px;
    }
</style>
