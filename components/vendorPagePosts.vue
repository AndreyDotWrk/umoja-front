<template>
	<div v-if="allPosts.length == 0" style="height: 100%; min-height: 200px" class="d-flex justify-center flex-column align-center ga-5 mt-10">
		<p>This vendor has not created any post yet.</p>
	</div>
	<div v-else>
		<div>
			<div style="background-color: " class="d-flex py-6 align-center justify-space-between">
				<p style="font-weight: 600; font-size: 12px; line-height: 15px; text-transform: uppercase; color: #969696">
					{{ allPosts.length }} posts found
				</p>
				<div>
					<v-btn style="border: 1px solid #e5e5e5; border-radius: 100px !important" variant="outlined" class="textClass text-grey-darken-3">
						<v-img class="mr-2" width="14" height="14" src="https://res.cloudinary.com/dd26v0ffw/image/upload/v1717990443/umoja/filtericon_ri5zov.svg" />
						Filter
					</v-btn>
				</div>
			</div>

			<v-carousel
				style="overflow: visible"
				height="170"
				class="promo promoshort d-block d-md-none"
				:show-arrows="false"
				hide-delimiter-background=""
				cycle
			>
				<v-carousel-item v-for="n in 6" :key="n">
					<v-img
						cover
						height="auto"
						min-height="160px"
						class="bg-black d-flex py-3 align-center rounded-lg"
						src="https://res.cloudinary.com/dd26v0ffw/image/upload/v1717990514/umoja/vendo-slide-banner_ojoipx.png"
					>
						<div>
							<v-row class="d-flex pa-4 px-4 justify-space-between align-center">
								<v-col cols="9" sm="9">
									<h1 style="line-height: 30px; font-size: 24px" class="mb-0 text-white font-weight-black">The Waden Cloth</h1>
									<p style="line-height: 15px; font-size: 12px" class="textClass mb-4 text-white">known to be used by the Nawi people</p>
									<div>
										<v-btn flat to="/product_page" color="orange"><span class="smallBtn"> See product </span> </v-btn>
										<v-btn flat variant="text" class="ml-2 text-white howit"
											><span style="text-decoration: underline">
												<span class="smallBtn"> Not now </span>
											</span>
										</v-btn>
									</div>
								</v-col>
								<v-col class="d-flex justify-end" cols="3" sm="3"> </v-col>
							</v-row>
						</div>
					</v-img>
				</v-carousel-item>
			</v-carousel>

			<v-row dense style="background-color: #fff" class="mt-8">
				<v-col cols="4" v-for="(n, i) in allPosts" :key="i" lg="4" md="6">
					<v-card flat style="border-radius: 15px" class="bg-white rounded-lg">
						<v-img
							v-if="n.featured_img.includes(',')"
							@click="openPost(n)"
							class="rounded-lg bg-grey-lighten-2"
							cover
							width="100%"
							:height="$vuetify.display.mobile ? 119 : 216"
							:src="n.featured_img.split(',')[0]"
						>
							<p
								class="text-white py-1 px-3"
								rounded="lg"
								style="
									font-size: 14px;
									line-height: 17px;
									position: absolute;
									right: 12px;
									top: 12px;
									border-radius: 3.34447px;
									background: rgba(0, 0, 0, 0.5);
								"
								flat
								size="x-small"
							>
								1/{{ n.featured_img.split(",").length }}
							</p>
						</v-img>
						<v-img
							v-if="!n.featured_img.includes(',')"
							@click="openPost(n)"
							class="rounded-lg bg-grey-lighten-2"
							cover
							width="100%"
							:height="$vuetify.display.mobile ? 119 : 216"
							:src="n.featured_img"
						>
						</v-img>
					</v-card>
				</v-col>
			</v-row>
			<v-dialog v-model="dialog" transition="dialog-bottom-transition" width="auto">
				<v-card
					style="height: 100vh; overflow: hidden; position: relative"
					max-width="700px"
					:min-width="$vuetify.display.mobile ? '90vw' : '60vw'"
					class="rounded-lg mx-auto"
				>
					<div class="d-flex d-md-none justify-end px-6 mt-2 mb-4">
						<v-icon class="" @click="dialog = false" size="24" icon="mdi mdi-close"></v-icon>
					</div>
					<v-row dense style="height: 100vh">
						<v-col cols="12" md="6" class="pr-md-0 mr-md-0" :style="{ borderRight: $vuetify.display.mobile ? '' : '1px solid #e4e4e4' }">
							<v-img
								v-if="selectedPost.featured_img.includes(',')"
								class="pb-0"
								:cover="$vuetify.display.mobile"
								width="100%"
								height="100%"
								:src="selectedPost.featured_img.split(',')[1]"
							></v-img>

							<v-img
								v-if="!selectedPost.featured_img.includes(',')"
								class="pb-0"
								:cover="$vuetify.display.mobile"
								width="100%"
								height="100%"
								:src="selectedPost.featured_img"
							></v-img>
						</v-col>
						<v-col cols="12" md="6">
							<div class="d-none d-md-flex justify-end mt-2 mb-4 px-6" style="">
								<v-icon class="" @click="dialog = false" size="24" icon="mdi mdi-close"></v-icon>
							</div>
							<div
								:style="{ height: $vuetify.display.mobile ? 'calc(100vh - 100%)' : 'calc(100vh - 100px)' }"
								style="position: relative; margin-bottom: 100px"
							>
								<v-sheet style="height: 100%; overflow-y: auto; position: absolute; width: 100%; bottom: 0" class="py-2">
									<div class="d-flex px-6 pb-4">
										<v-avatar size="48" class="mr-5">
											<v-img :src="selectedPost.vendor_profile_photo"></v-img>
										</v-avatar>
										<div class="w-100 d-flex justify-space-between">
											<div>
												<div class="d-flex">
													<p style="font-weight: 700; text-transform: capitalize; font-size: 16px; line-height: 140%; color: #1e1e1e">
														{{ selectedPost.vendor_lastname }} {{ selectedPost.vendor_firstname }}
													</p>
													<p class="" style="font-weight: 400; font-size: 14px; line-height: 140%; color: #969696">
														<v-icon class="mx-1" icon="mdi mdi-circle" size="6" color="grey-lighten-2"></v-icon>
														{{ getdateRegistered(selectedPost.created_at) }}
													</p>
												</div>
												<div class="d-flex">
													<v-chip size="x-small" class="px-3" color="#936900" rounded="0">{{ selectedPost.category_name }}</v-chip>
													<p class="" style="font-weight: 400; font-size: 14px; color: #1e1e1e">
														<v-icon class="mx-1" icon="mdi mdi-circle" size="6" color="grey-lighten-2"></v-icon>
														{{ selectedPost.location }}
													</p>
												</div>
											</div>
											<div class="pr-2">
												<v-icon icon="mdi mdi-dots-horizontal"></v-icon>
											</div>
										</div>
									</div>
									<div class="px-6">
										<p style="font-weight: 400; font-size: 16px; line-height: 140%; letter-spacing: 0.03em">
											{{ selectedPost.description }}
										</p>
										<div class="d-flex align-center py-2">
											<v-btn flat v-if="userLiked">
												<v-icon @click="handUnLike(selectedPost.id)" class="mr-1" icon="mdi mdi-heart"></v-icon>
												{{ selectedPost.likes }}
												{{ selectedPost.likes <= 1 ? "Like" : "Likes" }}
											</v-btn>
											<v-btn flat v-if="!userLiked">
												<v-icon @click="handleLike(selectedPost.id)" class="mr-1" icon="mdi mdi-heart-outline"></v-icon>
												{{ selectedPost.likes }}
												{{ selectedPost.likes <= 1 ? "Like" : "Likes" }}
											</v-btn>
											<v-btn flat>
												<v-icon class="mr-1" icon="mdi mdi-tray-arrow-up"></v-icon>
												Share Post
											</v-btn>
										</div>
									</div>

									<v-divider></v-divider>
									<div style="display: flex; flex-direction: column; justify-content: center; width: 100%; align-items: center">
										<p class="my-5" style="color: #333; font-size: 20px; text-align: center; font-weight: 600; line-height: 20px">Related products</p>

										<div v-if="selectedPost.products.length > 0" v-for="item in selectedPost.products" :key="item" class="cardStyle mb-4 w-75">
											<v-card flat color="grey-lighten-4" width="100%" height="313px" class="d-flex align-center justify-center rounded-lg">
												<v-btn
													rounded="xl"
													flat
													size="x-small"
													style="position: absolute; top: 15px; right: 15px"
													icon="mdi mdi-heart-outline"
												></v-btn>
												<v-img cover height="100%" width="100%" :src="item.photo.split(',')[0]"></v-img>
											</v-card>
											<p style="font-weight: 600; font-size: 14px; line-height: 18px; color: #000000" class="mt-2">
												{{ item.name }}
											</p>
											<p style="font-weight: 500; font-size: 12px; line-height: 15px; color: #000000" class="mt-1">
												{{ item.category_name }}
											</p>
											<p style="font-weight: 600; font-size: 12px; line-height: 13px; color: #000000" class="d-flex my-1 align-center">
												<v-rating v-model="rating" color="grey-lighten-2" active-color="#E7CE5D" class="" density="compact" size="small"></v-rating>
												<span style="margin-left: 9px">(0)</span>
											</p>
											<div class="d-flex align-center justify-space-between">
												<div class="d-flex align-center">
													<h1 style="font-size: 16px; line-height: 20px; color: #1a1d1f" class="priceClass">
														{{ formattedPrice(item.price) }}
													</h1>
												</div>
												<v-btn style="border: 1px solid #e5e5e5" size="small" variant="outlined">
													<span style="color: var(--grey-1000, #1a1d1f); font-size: 12px; font-weight: 600"> Add to Cart </span>
												</v-btn>
											</div>
										</div>
									</div>
								</v-sheet>
							</div>

							<!-- <div class="py-5 bg-white w-100 bg-red" style=""></div> -->
						</v-col>
					</v-row>
				</v-card>
			</v-dialog>
		</div>
	</div>
</template>
<style>
.pts .v-rating__item .v-btn .v-icon {
	transition: inherit;
	font-size: 16px;
}
.pts .v-rating__item .v-btn {
	scale: 0.8;
	margin-left: -16px;
}
.v-responsive__sizer {
	padding-bottom: 0 !important;
}
</style>
<script setup>
import { ref, onMounted, computed } from "vue";
import { getdateRegistered } from "~/utils/date";
import { formattedPrice } from "~/utils/price";
import { likePost, hasLiked, unlikePost } from "~/composables/useLike";

const props = defineProps({
	allPosts: {
		type: Array,
		required: true,
	},
});
const selectedPost = ref(null);
const dialog = ref(false);
const userLiked = ref(false);
const placescards = ref(false);
const mods = ref(1);
const rating = ref(4);

watch(
	() => selectedPost.value,
	async () => {
		userLiked.value = await hasLiked(selectedPost.value.id);
	}
);
const handUnLike = async (id) => {
	userLiked.value = false;
	selectedPost.value.likes--;
	await unlikePost(id);
};
const handleLike = async (id) => {
	userLiked.value = true;
	selectedPost.value.likes++;
	await likePost(id);
};
const openPost = (post) => {
	selectedPost.value = post;

	dialog.value = true;
};

function filt(text) {
	var newText = text.length > 40 ? text.slice(0, 40) + "..." : text;
	return newText;
}
</script>
