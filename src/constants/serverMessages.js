const serverMessages = {
    user: {
        user_not_found: "user_not_found",
        error_to_get_user: "error_to_get_user",
    },
    photos: {
        //error messages
        error_to_load_photos: "error_to_load_photos",
        error_to_load_approved_photos: "error_to_load_approved_photos",
        error_to_load_unapproved_photos: "error_to_load_unapproved_photos",
        error_to_get_photo_by_id: "error_to_get_photo_by_id",
        error_to_load_highlight_photos: "error_to_load_highlight_photos",
        error_to_post_new_photos: "error_to_post_new_photos",
        error_to_update_photo: "error_to_update_photo",
        error_to_approve_photo: "error_to_approve_photo",
        error_to_unapprove_photo: "error_to_unapprove_photo",
        error_to_higilight_photo: "error_to_higilight_photo",
        error_to_unhigilight_photo: "error_to_unhigilight_photo",
        error_to_delete_photo: "error_to_delete_photo",
        //success messages
        photos_received: "photos_received",
        photo_received: "photo_received",
        photo_was_updated: "photo_was_updated",
        photo_was_approved: "photo_was_approved",
        photo_was_unapproved: "photo_was_unapproved",
        photo_was_highlighted: "photo_was_highlighted",
        photo_was_unhighlighted: "photo_was_unhighlighted",
        photo_deleted: "photo_deleted"
    }
}

module.exports = serverMessages