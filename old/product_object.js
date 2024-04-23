// FROM HERE: https://shopify.dev/docs/api/admin-graphql/2024-04/objects/Product

/* 

Fields
Anchor to Product.availablePublicationsCount
availablePublicationsCount
Count
The number of publications a resource is published to without feedback errors.


Show fields
Anchor to Product.category
category
TaxonomyCategory
The taxonomy category specified by the merchant.


Show fields
Anchor to Product.compareAtPriceRange
compareAtPriceRange
ProductCompareAtPriceRange
The compare-at price range of the product in the default shop currency.


Show fields
Anchor to Product.contextualPricing
contextualPricing
ProductContextualPricing!
non-null
The pricing that applies for a customer in a given context.


Show arguments and fields
Anchor to Product.createdAt
createdAt
DateTime!
non-null
The date and time (ISO 8601 format) when the product was created.

Anchor to Product.defaultCursor
defaultCursor
String!
non-null
A default cursor that returns the single next record, sorted ascending by ID.

Anchor to Product.description
description
String!
non-null
A stripped description of the product, single line with HTML tags removed.


Show arguments
Anchor to Product.descriptionHtml
descriptionHtml
HTML!
non-null
The description of the product, complete with HTML formatting.

Anchor to Product.featuredImage
featuredImage
Image
The featured image for the product.


Show fields
Anchor to Product.featuredMedia
featuredMedia
Media
The featured media for the product.


Show fields
Anchor to Product.feedback
feedback
ResourceFeedback
Information about the product that's provided through resource feedback.


Show fields
Anchor to Product.giftCardTemplateSuffix
giftCardTemplateSuffix
String
The theme template used when viewing the gift card in a store.

Anchor to Product.handle
handle
String!
non-null
A unique human-friendly string of the product's title.

Anchor to Product.hasOnlyDefaultVariant
hasOnlyDefaultVariant
Boolean!
non-null
Whether the product has only a single variant with the default option and value.

Anchor to Product.hasOutOfStockVariants
hasOutOfStockVariants
Boolean!
non-null
Whether the product has out of stock variants.

Anchor to Product.hasVariantsThatRequiresComponents
hasVariantsThatRequiresComponents
Boolean!
non-null
Determines if at least one of the product variant requires components. The default value is false.

Anchor to Product.id
id
ID!
non-null
A globally-unique ID.

Anchor to Product.inCollection
inCollection
Boolean!
non-null
Whether the product is in a given collection.


Show arguments
Anchor to Product.isGiftCard
isGiftCard
Boolean!
non-null
Whether the product is a gift card.

Anchor to Product.legacyResourceId
legacyResourceId
UnsignedInt64!
non-null
The ID of the corresponding resource in the REST Admin API.

Anchor to Product.mediaCount
mediaCount
Count
Total count of media belonging to a product.


Show fields
Anchor to Product.metafield
metafield
Metafield
Returns a metafield by namespace and key that belongs to the resource.


Show arguments and fields
Anchor to Product.onlineStorePreviewUrl
onlineStorePreviewUrl
URL
The online store preview URL.

Anchor to Product.onlineStoreUrl
onlineStoreUrl
URL
The online store URL for the product. A value of null indicates that the product isn't published to the Online Store sales channel.

Anchor to Product.options
options
[ProductOption!]!
non-null
A list of product options. The limit is specified by Shop.resourceLimits.maxProductOptions.


Show arguments and fields
Anchor to Product.priceRangeV2
priceRangeV2
ProductPriceRangeV2!
non-null
The price range of the product with prices formatted as decimals.


Show fields
Anchor to Product.productType
productType
String!
non-null
The product type specified by the merchant.

Anchor to Product.publishedAt
publishedAt
DateTime
The date and time (ISO 8601 format) when the product was published to the Online Store.

Anchor to Product.publishedInContext
publishedInContext
Boolean!
non-null
Whether or not the product is published for a customer in the given context.


Show arguments
Anchor to Product.publishedOnCurrentPublication
publishedOnCurrentPublication
Boolean!
non-null
Check to see whether the resource is published to the calling app's publication.

Anchor to Product.publishedOnPublication
publishedOnPublication
Boolean!
non-null
Check to see whether the resource is published to a given publication.


Show arguments
Anchor to Product.requiresSellingPlan
requiresSellingPlan
Boolean!
non-null
Whether the product can only be purchased with a selling plan (subscription). Products that are sold on subscription (requiresSellingPlan: true) can be updated only for online stores. If you update a product to be subscription only, then the product is unpublished from all channels except the online store.

Anchor to Product.resourcePublicationOnCurrentPublication
resourcePublicationOnCurrentPublication
ResourcePublicationV2
The resource that's either published or staged to be published to the calling app's publication. Requires the read_product_listings scope.


Show fields
Anchor to Product.resourcePublicationsCount
resourcePublicationsCount
Count
The number of publications a resource is published on.


Show arguments and fields
Anchor to Product.sellingPlanGroupsCount
sellingPlanGroupsCount
Count
Count of selling plan groups associated with the product.


Show fields
Anchor to Product.seo
seo
SEO!
non-null
SEO information of the product.


Show fields
Anchor to Product.status
status
ProductStatus!
non-null
The product status. This controls visibility across all channels.


Show enum values
Anchor to Product.tags
tags
[String!]!
non-null
A comma separated list of tags associated with the product. Updating tags overwrites any existing tags that were previously added to the product. To add new tags without overwriting existing tags, use the tagsAdd mutation.

Anchor to Product.templateSuffix
templateSuffix
String
The theme template used when viewing the product in a store.

Anchor to Product.title
title
String!
non-null
The title of the product.

Anchor to Product.totalInventory
totalInventory
Int!
non-null
The quantity of inventory in stock.

Anchor to Product.tracksInventory
tracksInventory
Boolean!
non-null
Whether inventory tracking has been enabled for the product.

Anchor to Product.translations
translations
[Translation!]!
non-null
The translations associated with the resource.


Show arguments and fields
Anchor to Product.updatedAt
updatedAt
DateTime!
non-null
The date and time when the product was last modified. A product's updatedAt value can change for different reasons. For example, if an order is placed for a product that has inventory tracking set up, then the inventory adjustment is counted as an update.

Anchor to Product.variantsCount
variantsCount
Count
The number of variants that are associated with the product.


Show fields
Anchor to Product.vendor
vendor
String!
non-null
The name of the product's vendor.






*/
