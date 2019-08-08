<template>
    <div>
        <h1>Hello World</h1>
    </div>
</template>
<script>
    export default {
        layout: 'head',
        async asyncData ({ params }) {
            const slug = params.slug // When calling /abc the slug will be "abc"
            console.log(params)
            console.log(slug)
            return { slug }
        },
        key(route) {
            return route.fullPath
        }
    }
</script>