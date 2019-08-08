<template>
    <div>
        <h2>Users</h2>
        <ul class="users">
            <li v-for="user in users" :key="user.id">
                <NuxtLink :to="'/users/'+user.id">
                    {{ user.name }}
                </NuxtLink>
            </li>
        </ul>
    </div>
</template>

<script>
    import axios from 'axios'

    export default {
        layout: 'head',
        async asyncData() {
            const { data } = await axios.get('https://jsonplaceholder.typicode.com/users')
            return { users: data }
        }
    }
</script>