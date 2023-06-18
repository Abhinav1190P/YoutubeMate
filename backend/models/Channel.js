const mongoose = require('mongoose');

// Video Schema
const videoSchema = new mongoose.Schema({
  videoId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  videosnippet: {
    publishedAt: {
      type: Date,
      required: true
    },
    channelId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    channelTitle: {
      type: String,
      required: true
    },
    tags: {
      type: [String],
      default: ["No tags available"]
    },
    categoryId: {
      type: Number,
      required: true
    }
  },
  videothumbnails: {
    url: {
      type: String,
      required: true
    },
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    }
  },
  videocredentials: {
    duration: {
      type: String,
      required: true
    },
    dimension: {
      type: String,
      required: true
    },
    definition: {
      type: String,
      required: true
    },
    caption: {
      type: String,
      required: true
    },
    licensedContent: {
      type: Boolean,
      required: true
    },
    projection: {
      type: String,
      required: true
    }
  },
  videostatistics: {
    viewCount: {
      type: Number,
      required: true
    },
    likeCount: {
      type: Number,
      default: 0
    },
    favoriteCount: {
      type: Number,
      required: true
    },
    commentCount: {
      type: Number,
      required: true
    }
  }
});


const channelSchema = new mongoose.Schema({
  userId:{
    type:String,
    required:true
  },
  channelId: {
    type: String,
    required: true
  },
  snippet: {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: false
    },
    customUrl: {
      type: String,
      required: true
    },
    publishedAt: {
      type: Date,
      required: true
    }
  },
  thumbnails: {
    url: {
      type: String,
      required: true
    },
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    }
  },
  statistics: {
    viewCount: {
      type: Number,
      required: true
    },
    subscriberCount: {
      type: Number,
      required: true
    },
    hiddenSubscriberCount: {
      type: Number,
      default: 0
    },
    videoCount: {
      type: Number,
      required: true
    }
  },
  videos: {
    type: [videoSchema],
    default: []
  }
});

const Channel = mongoose.model('Channel', channelSchema);

module.exports = {Channel};
