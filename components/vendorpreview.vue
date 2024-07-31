<template>
	<div id="homepage" style="min-height: 100vh; width: 100%">
		<v-img
			style="height: 185px; position: relative"
			width="100%"
			cover
			class="d-flex bg-grey justify-end align-end"
			:src="
				vendor.vendor_details?.cover_image
					? vendor.vendor_details?.cover_image
					: 'https://res.cloudinary.com/dd26v0ffw/image/upload/v1718893068/umoja-backup2/Rectangle_448_2_lh8kz3_fhxaab.png'
			"
		>
			<v-container style="max-width: 1400px; height: 100%; width: 100%" class="d-flex flex-column pt-6 justify-between align-start">
				<v-label
					size="large"
					rounded="xl"
					flat
					for="profile"
					class="d-flex align-center text-white"
					style="
						text-transform: none !important;
						background-color: rgba(0, 0, 0, 0.7);
						padding: 10px;
						border-radius: 20px;
						position: absolute;
						top: 20px;
					"
					><v-icon icon="mdi mdi-pencil-outline" class="mx-2" size="21"></v-icon>
					<span style="font-size: 12px; font-weight: 400"> Edit Cover Photo </span>
					<input @change="upLoadFile1($event)" id="profile" type="file" style="display: none" accept=".svg, .png, .jpeg, .jpg, .gif" />
				</v-label>
				<v-progress-circular
					v-if="coverLoading"
					style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%)"
					color="black"
					indeterminate
				></v-progress-circular>
				<p v-show="errorMessage" class="align-self-center" style="color: red; font-size: 16px">{{ errorMessage }}</p>
			</v-container>
		</v-img>
		<v-card class="overflow-visible pr-2" flat tile color="#Fff" min-height="100vh" width="100%">
			<v-container style="max-width: 1300px">
				<v-row>
					<v-col md="4" cols="12" xs="12">
						<v-card
							variant="outlined"
							style="border: 1px solid #cecece; margin-top: -45px; border-radius: 16px; z-index: 99"
							flat
							class="pb-12 bg-white"
							width="100%"
						>
							<v-sheet max-width="455" class="mx-auto" width="100%" style="padding-top: 20px">
								<div class="text-center pa-4">
									<v-avatar class="mx-auto" size="100" :style="`border: 3px solid ${profileBorderColor};`">
										<v-img v-if="vendor.vendor_details?.profile_photo" class="bg-grey-lighten-3" cover :src="vendor.vendor_details?.profile_photo">
										</v-img>
										<v-img
											v-else
											cover
											class="bg-grey-lighten-3 rounded-xl"
											src="https://res.cloudinary.com/dd26v0ffw/image/upload/v1717990483/umoja/profile_image_pd4dcv_alvzjz.png"
										></v-img>
									</v-avatar>
									<h3 class="py-4" style="font-size: 24px; font-weight: 800; line-height: 30px; text-transform: capitalize">
										{{ vendor.vendor_details?.business_name }}
										<!-- <v-icon color="#1273EB" size="22" icon="mdi mdi-check-decagram"></v-icon> -->
									</h3>
									<v-chip :color="connected ? 'green' : 'red'">
										{{ connected ? 'Connected' : 'Not Connected' }}
									</v-chip>
									<v-btn flat color="green" size="default" class="menubar" style="display: block; width: 100%; margin: 20px auto 10PX;">
										<!-- <v-icon class="mr-2" icon="mdi mdi-share"></v-icon> -->
										{{ connected ?  'View Stripe Account': 'Connect Stripe Account' }}
									</v-btn>
								</div>
					
								<div class="px-4 py-0 m-0">
									<v-divider></v-divider>
									<div class="pa-4 px-6 align-center justify-space-between d-flex">
										<div class="align-center d-flex">
											<v-avatar rounded="0" size="23"
												><v-img src="https://res.cloudinary.com/dd26v0ffw/image/upload/v1717990484/umoja/profile-2user_2_jcekww_nw2jiw.png"></v-img
											></v-avatar>
											<p class="textClass text-grey-darken-1 px-2">Followers</p>
										</div>

										<p class="priceClass">{{ vendor.vendor_details?.followers_count }}</p>
									</div>
									<v-divider></v-divider>
									<div class="pa-4 px-6 align-center justify-space-between d-flex">
										<div class="align-center d-flex">
											<v-avatar rounded="0" size="23"
												><v-img src="https://res.cloudinary.com/dd26v0ffw/image/upload/v1719302755/game-icons_africa_b7x2hf_mxocvp.png"></v-img
											></v-avatar>
											<p class="textClass text-grey-darken-1 px-2">Country</p>
										</div>
										<span style="font-size: 1.5rem">{{ getFlag() }}</span>
										<!-- <span style="font-size: 1.5rem;" :class="getCountryIconClass"></span> -->
									</div>
									<v-divider></v-divider>
									<div class="pa-4 px-6 align-center d-flex">
										<v-avatar rounded="0" size="19"
											><v-img src="https://res.cloudinary.com/dd26v0ffw/image/upload/v1717990457/umoja/location_q0ouqw_pv4z9t.png"></v-img
										></v-avatar>
										<p class="textClass px-4" style="text-transform: capitalize">
											{{ vendor.vendor_details?.address }}, {{ vendor.vendor_details?.city }}, {{ vendor.vendor_details?.state }}
											{{ vendor.vendor_details?.country_name }}
										</p>
									</div>
									<v-divider></v-divider>
								</div>

								<v-sheet class="px-6 pt-8">
									<h3 style="font-weight: 700; font-size: 24px; line-height: 30px; color: #333333">
										BIO <span class="text-grey">({{ vendor.vendor_details?.business_type }})</span>
									</h3>

									<p class="textClass text-left mt-4 mb-8">
										{{ vendor.vendor_details?.business_bio }}
									</p>

									<p style="font-weight: 700; font-size: 12px; line-height: 20px; color: #969696">ON THE WEB</p>
									<div class="pt-4 justify-start align-center d-flex">
										<v-btn
											size="small"
											@click="openSocialMedia(n.icon, n.handle)"
											style="border: 0.357149px solid #2c6e63"
											class="green-hover rounded-xl mr-4"
											variant="outlined"
											:key="n.icon"
											v-for="n in buttons"
											flat
											icon
										>
											<v-avatar rounded="0" size="23"><v-icon color="green" :icon="'mdi mdi-' + n.icon"></v-icon></v-avatar>
										</v-btn>
									</div>
									<!-- <div class="pt-12 mt-12 justify-start align-center d-flex">
										<v-btn
											@click="choose('Profile Setup')"
											style="border: 0.357149px solid #2c6e63"
											flat
											size="large"
											variant="text"
											block
											class="green-hover mb-8"
											color="green"
										>
											<v-icon class="mr-2" icon="mdi mdi-pencil"></v-icon> Edit Profile
										</v-btn>
									</div> -->

									<p class="text-center textClass text-grey-darken-1 pt-12">MEMBER SINCE: {{ getdateRegistered(vendor.created) }}</p>
								</v-sheet>
							</v-sheet>
						</v-card>
					</v-col>
					<v-col md="8" xs="12">
						<v-sheet style="overflow: hidden" color="transparent" class="mt-2">
							<v-tabs v-model="tab" color="green" grow>
								<v-tab v-for="item in ['products', 'posts', 'articles', 'promo%']" :key="item" :value="item" class="d-flex align-center">
									{{ item }}
									<v-badge
										v-if="item == 'posts'"
										class="ml-4 mb-1 px-1"
										rounded="lg"
										color="grey-lighten-2"
										:content="vendor.vendor_details?.post_count"
										size="12"
									></v-badge>
									<v-badge
										v-if="item == 'products'"
										class="ml-4 mb-1 px-1"
										rounded="lg"
										color="grey-lighten-2"
										:content="vendor.vendor_details?.product_count"
										size="12"
									></v-badge>
									<v-badge
										v-if="item == 'articles'"
										class="ml-4 mb-1 px-1"
										rounded="lg"
										color="grey-lighten-2"
										:content="vendor.vendor_details?.article_count"
										size="12"
									></v-badge>
									<v-badge
										v-if="item == 'promo%'"
										class="ml-4 mb-1 px-1"
										rounded="lg"
										color="grey-lighten-2"
										:content="vendor.vendor_details?.promo_count"
										size="12"
									></v-badge>
								</v-tab>
							</v-tabs>
							<v-divider></v-divider>
							<v-window v-model="tab">
								<v-window-item value="products">
									<Vendorproductstab />
								</v-window-item>
								<v-window-item value="posts">
									<Vendorposts />
								</v-window-item>
								<v-window-item value="articles">
									<Vendorarticles />
								</v-window-item>
								<v-window-item value="promo%">
									<Vendorpromo />
								</v-window-item>
							</v-window>
							<p style="font-weight: 400; font-size: 14px; line-height: 17px; color: #cecece" class="font-weight-regular pt-12 mt-12 mb-4">
								©2022 Umoja. All Rights Reserved.
							</p>
						</v-sheet>
					</v-col>
				</v-row>
			</v-container>
			<v-dialog v-model="vendorStore.showRegistrationModal" max-width="600">
				<v-card>
					<v-card-title class="text-h5">Welcome! 🌟</v-card-title>
					<v-card-text>
						It’s great to have you here. Before you dive into adding and selling products, let’s complete your vendor profile. Head over to your
						profile settings to provide essential details. Once that’s done, you’ll be all set to showcase your amazing products to the world!
					</v-card-text>
					<v-card-actions>
						<v-spacer></v-spacer>
						<v-btn @click="completeReg()" class="bg-green" color="white" rounded-lg text>Complete Registration</v-btn>
					</v-card-actions>
				</v-card>
			</v-dialog>
		</v-card>
	</div>
</template>
<script>
import { useVendorStore } from "~/stores/vendorStore";
import { countryCodes } from "~/utils/countryapi";
import { getdateRegistered } from "~/utils/date";
import { useRouter } from "vue-router";
import ColorThief from "colorthief";
import { ref, onMounted, computed } from "vue";
import { useCreateStore } from "~/stores/createPostStore";
import { useVendorProductStore } from "~/stores/vendorProducts";
import imageCompression from 'browser-image-compression';
import axios from "axios";
import emojiFlags from "emoji-flags";

export default {
	setup(props, ctx) {
    const config = useRuntimeConfig()
    const baseURL = config.public.backendApiUrl;
    const vendorStore = useVendorStore();
		const vendor = ref(vendorStore.vendor);
		const vendorProducts = useVendorProductStore();
		const router = useRouter();
		const postStore = useCreateStore();
		const coverLoading = ref(false);
		const errorMessage = ref("");
		const connected = ref(false)
		const choose = (x) => {
			ctx.emit("changePage", x);
		};

async function upLoadFile1(event) {
    coverLoading.value = true;
    const file = event.target.files[0];
    if (!file) {
        coverLoading.value = false;
        return;
    }

    const allowedFiles = ['.png', '.jpeg', '.jpg'];
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (!allowedFiles.includes('.' + fileExtension)) {
        errorMessage.value = 'Please upload files having extensions: ' + allowedFiles.join(', ');
        coverLoading.value = false;
        return;
    }

    errorMessage.value = '';

    const options = {
        maxSizeMB: 1,
        useWebWorker: true,
    };

    try {
        const compressedFile = await imageCompression(file, options);

        const formData = new FormData();
        formData.append('cover_image', compressedFile);

        const res = await axios.post(baseURL + '/vendor/upload/cover_image', formData, {
            headers: {
                Authorization: `Bearer ${useVendorStore().vendorToken}`,
            },
        });

        const data = {
            cover_image: res.data.cover_image,
        };

        if (res.data.cover_image) {
            await useVendorStore().registerVendor(data);
        }
    } catch (error) {
        console.error(error);
        if (error.response) {
            errorMessage.value = error.response.data.message || 'An error occurred during file upload.';
        } else if (error.request) {
            errorMessage.value = 'No response received from server. Please try again later.';
        } else {
            errorMessage.value = 'An error occurred. Please try again later.';
        }
    } finally {
        coverLoading.value = false;
    }
}

		watch(
			() => vendorStore.vendor,
			(newpost, oldpost) => {
				vendor.value = newpost;
			}
		);

		const openSocialMedia = (icon, handle) => {
			window.open(`https://${icon}.com/${handle}`, "_blank");
		};

		function completeReg() {
			vendorStore.showRegistrationModal = false;
			router.push("/vendor/dashboard/Profile Setup");
		}
		return {
			vendorStore,
			postStore,
			vendor,
			choose,
			openSocialMedia,
			completeReg,
			vendorProducts,
			upLoadFile1,
			errorMessage,
			coverLoading,
			connected
		};
	},
	data() {
		return {
			placescards: false,
			mods: 1,
			window: "products",
			rating: 4,
			tab: null,
			profileBorderColor: "#F38218",
		};
	},

	computed: {
		getCountryIconClass() {
			const countryCode = this.getCountryCode();
			if (!countryCode) {
				return ""; // Or provide a default class
			}
			return `fi fi-${countryCode.toLowerCase()}`;
		},
		buttons() {
			return [
				{
					icon: "youtube",
					handle: this.vendor.vendor_details?.youtube_handle,
				},
				{
					icon: "twitter",
					handle: this.vendor.vendor_details?.twitter_handle,
				},
				{
					icon: "facebook",
					handle: this.vendor.vendor_details?.facebook_handle,
				},
				{
					icon: "instagram",
					handle: this.vendor.vendor_details?.instagram_handle,
				},
			];
		},
		cols() {
			const { lg, sm, md } = this.$vuetify.display;
			return lg
				? [4, 6, 6, 6, 4, 8, 4, 3, 10, 2]
				: md
				? [4, 6, 6, 12, 6, 8, 4, 3, 10, 2]
				: sm
				? [6, 12, 12, 12, 12, 12, 12, 12, 12]
				: [6, 12, 12, 12, 12, 12, 12, 12, 12];
		},
	},
	mounted() {
		const img = new Image();
		img.crossOrigin = "Anonymous";
		img.src = this.vendor.vendor_details?.profile_photo;
		img.onload = () => {
			const colorThief = new ColorThief();
			const dominantColor = colorThief.getColor(img);
			this.profileBorderColor = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;
		};
		img.onerror = () => {
			console.error("Cannot load image");
		};
	},
	methods: {
		getFlag() {
			const countryCode = this.getCountryCode();
			if (countryCode) {
				return emojiFlags.countryCode(countryCode).emoji;
			}
		},
		getCountryCode() {
			const country = this.vendor.vendor_details?.rep_country;
			return countryCodes[country];
		},
	},
	filt(text) {
		var newText = text.length > 40 ? text.slice(0, 40) + "..." : text;
		return newText;
	},
};
</script>
<style>
.v-carousel.promo .v-btn.v-btn--icon {
	border-radius: 50% !important;
}
.v-carousel.promo .v-btn--icon .v-icon {
	font-size: 9px;
	color: #cecece;
}
.v-carousel.promo .v-btn--icon.v-btn--active .v-icon {
	color: orange;
}

.v-carousel--hide-delimiter-background .v-carousel__controls {
	bottom: -46px;
}
</style>
