<template>
	<v-container style="margin-bottom: 50px" class="parent-container" :style="'max-width:' + maxw">
		<div class="d-flex my-4 align-center">
			<div
				class=""
				:style="{
					color: 'var(--magnetic-green-4, #000)',
					fontSize: $vuetify.display.mobile ? '24px' : '32px',
					fontWeight: '600',
					width: 'auto',
					minWidth: '155px',
					lineHeight: '120%' /* 16.8px */,
					letterSpacing: '-0.24px',
				}"
			>
				{{ title }}
			</div>
			<v-divider style="flex: auto" class="mx-2"></v-divider>
			<v-btn class="d-none d-md-flex" color="#333" size="large" style="" variant="outlined" rounded="xl">
				See All <v-icon class="ml-1" icon="mdi mdi-arrow-top-right"></v-icon>
			</v-btn>
		</div>

		<div class="rower h-auto pb-2 mt-10 mb-5">
			<v-chip-group v-model="category" block color="green" class="d-inline-block">
				<v-chip
					:value="n.category"
					style="border-radius: 6px; border: 1px solid var(--carbon-2, #cecece)"
					v-for="n in filters"
					:key="n"
					rounded="xl"
					close-icon="mdi mdi-close-circle-outline"
					class="px-5 py-4"
					variant="outlined"
					grow
					active-class="bordergreen text--green "
				>
					<span style="font-size: 14px; font-weight: 500; letter-spacing: -0.42px">{{ n.name }}</span>
				</v-chip>
			</v-chip-group>
		</div>

		<div id="homepage" style="background: transparent !important" class="rower mt-8 d-none d-md-block">
			<div v-if="stores?.length == 0" class="d-inline-block mr-4" style="width: 254px" v-for="n in [1,2,3,4,5]" :key="n">
				<vendorloader />
			</div>
			<div v-else class="d-inline-block mr-4" style="width: 254px" v-for="(n, i) in stores" :key="i">
				<vendor-component :category="category" v-if="vendorBol" :index="i" :item="n" />
				<product-component :cover="coverbol" :category="category" v-else :index="i" :showVendor="showVendor" :showdisco="showdisco" :item="n" />
			</div>
		</div>

		<!-- For mobile View -->
		<div class="d-block d-md-none">
			<v-row dense v-if="stores?.length == 0">
				<v-col v-for="n in [1,2,3,4,5]" :key="n" cols="6" :md="6" :lg="3">
					<vendorloader />
				</v-col>
			</v-row>
			<v-row v-else dense>
				<v-col v-for="(n, i) in stores" :key="i" cols="6" :md="6" :lg="3">
					<vendor-component v-if="vendorBol" :category="category" :index="i" :item="n" />
					<product-component v-else :cover="coverbol" :category="category" :showVendor="showVendor" :showdisco="showdisco" :item="n" />
				</v-col>
			</v-row>
			<v-btn
				block
				class="d-flex d-md-none mt-8"
				color="#333"
				size="large"
				style="border: 1px solid #333; font-weight: 500; color: #333"
				variant="outlined"
				rounded="xl"
			>
				<span style="font-size: 14px">See All</span> <v-icon class="ml-1" icon="mdi mdi-arrow-top-right"></v-icon>
			</v-btn>
		</div>
	</v-container>
</template>
<style>
.divbtn {
	transition: all 0.3s ease-in-out;
}
/* .parent-container:hover .divbtn .v-btn__content {
color: #fff!important;
} */
/* .parent-container:hover .divbtn {
  background-color: #333;
  border: none!important;
} */
</style>
<script>
import { useProductStore } from "~/stores/productStore.js";
import { bestSellingStores } from "~/composables/useProducts";
import {ref} from 'vue';
import Vendorloader from './vendorloader.vue';
import vendorloader from './vendorloader.vue';

export default {
  components: { vendorloader },
	setup(){
		const productStore = useProductStore()
		const category = ref("")
		const stores = computed(() => productStore.bestSelling[category.value])
		const filters = [
				{name: 'All',
				 id: "",
				 category: "all"
				},
				{name: "Art",
				 id: 3,
				 category: "art"
				},
				{name: "Home Decoration",
				 id: 4,
				 category: "homeDecoration"
				},
				{name: "Cosmetics",
				 id: 2,
				 category: "cosmetics"
				},
				{name: "Accessories",
				 id: 6,
				 category: "accessories"
				},
				{name: "Fashion",
				 id: 1,
				 category: "fashion"
				},
				{name: "Furniture",
				 id: 5,
				 category: "furniture"
				},
			]

	async function fetchStores(id, category){
		if (productStore.bestSelling[category].length === 0) {
        await bestSellingStores(id, category);
      }
	}
	onMounted(async() => {
		productStore.bestSelling = {
									all: [],
									art: [],
									homeDecoration: [],
									cosmetics: [],
									accessories: [],
									fashion: [],
									furniture: []
   									 }
		category.value = "all"
	})
	  watch(() => category.value, async (newVal) => {
		const selectedFilter = filters.find(filter => filter.category == newVal)
		if(selectedFilter){
			fetchStores(selectedFilter.id, selectedFilter.category)
		}
	  })
		return{
			productStore,
			category,
			filters,
			fetchStores,
			stores
		}
	},
	props: ["showVendor", "cover", "showdisco", "vendor", "items", "title", "maxwidth"],
	computed: {
		maxw() {
			return this.maxwidth ? this.maxwidth : "1400px";
		},
		vendorBol() {
			return this.vendor ? this.vendor : false;
		},
		coverbol() {
			// Returns true if this.cover is set, otherwise returns true
			return this.cover !== undefined ? this.cover : true;
		},
		items() {
			if (this.vendor) {
				if (this.vendor == true) {
					return this.vendorlist;
				} else {
					return this.getitems;
				}
			} else {
				return this.getitems;
			}
		},
		getitems() {
			if (this.items) {
				if (this.items.length > 0) {
					return this.items;
				} else {
					return this.productStore.getProductsArray("row");
				}
			} else {
				return this.productStore.getProductsArray("row");
			}
		},
	},
	data() {
		return {
			loaded: false,

		};
	},
	methods: {
		filt(text) {
			var newText = text.length > 50 ? text.slice(0, 50) + "..." : text;
			return newText;
		},
	},
};
</script>
