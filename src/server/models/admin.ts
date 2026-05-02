// @ts-nocheck
import { model, schemaOptions, Schema, stringId } from "./common";

const AdminActivityLogSchema = new Schema(
  {
    _id: stringId(),
    description: { type: String, required: true, index: true },
    table: { type: String, index: true },
    action: { type: String, required: true, index: true },
    ipAddress: String,
    userAgent: String,
  },
  schemaOptions,
);

const AdminSettingsSchema = new Schema(
  {
    _id: stringId(),
    title: { type: String, required: true, index: true },
    metadata: { type: Schema.Types.Mixed, required: true },
  },
  schemaOptions,
);

const EditorTopicPermissionSchema = new Schema(
  {
    _id: stringId(),
    editorId: { type: String, required: true },
    topicId: { type: String, required: true, index: true },
    assignedById: String,
    canCreate: { type: Boolean, default: true },
    canUpdate: { type: Boolean, default: true },
    canDelete: { type: Boolean, default: true },
  },
  schemaOptions,
);
EditorTopicPermissionSchema.index({ editorId: 1, topicId: 1 }, { unique: true });

export const AdminActivityLog = model("AdminActivityLog", AdminActivityLogSchema, "tbl_admin_activity_log");
export const AdminSettings = model("AdminSettings", AdminSettingsSchema, "tbl_admin_settings");
export const EditorTopicPermission = model("EditorTopicPermission", EditorTopicPermissionSchema, "editor_topic_permissions");
