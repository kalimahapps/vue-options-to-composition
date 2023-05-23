# Vue Options to Composition API Converter

## Introduction
This is an online tool to convert Vue 2 options API code to Vue 3 composition API code.

## Example
Input Vue 2 options API code:
```js
export default {
	data:{
      items: [],
      list: {},
    },
  props: ['loading', 'lazy', 'disabled'],
  methods:{
  	isLazy(){
      return this.lazy;
    },
    isLoading: function(){
      return this.loading;
    },
    isDisabled: () => {
      return this.disabled;
    }
  },
  watch:{
    loading(newValue){
      console.log("Value", newValue);
    },
    disabled:{
      immediate: true,
    handler(value) {
      this.bar = value;
    }
    }

  }
}
```

Output Vue 3 composition API code:
```js
import { reactive, watch } from 'vue';


// Data
const items = reactive([]);
const list = reactive({});

// Props
const props = defineProps(['loading', 'lazy', 'disabled']);

// Methods
const isLazy = function(){
	return props.lazy;
}

const isLoading = function(){
	return props.loading;
}

const isDisabled = () => {
	return props.disabled;
}


// Watch
watch(loading, function(newValue){
	console.log("Value", newValue);
})

watch(disabled, function (value) {
	this.bar = value;
}, { immediate: true })
```

