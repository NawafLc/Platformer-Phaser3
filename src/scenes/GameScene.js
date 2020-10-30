import Phaser from "phaser";
import BackgroundREF from '../assets/images/background.png';
import SpikeREF from '../assets/images/spike.png';
import PlayerREF from '../assets/images/kenney_player.png';
import PlayerJSONREF from '../assets/images/kenney_player_atlas.json';
import TilesetREF from '../assets/tilesets/platformPack_tilesheet.png';
import MapREF from '../assets/tilemaps/level1.json';

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }
    preload() {
        this.load.image('background', BackgroundREF);
        this.load.image('spike', SpikeREF);

        this.load.atlas('player', PlayerREF, PlayerJSONREF);
        this.load.image('tiles', TilesetREF);

        this.load.tilemapTiledJSON('map', MapREF);
    }
    create() {
        const backgroundImage = this.add.image(0, 0, 'background').setOrigin(0, 0);
        backgroundImage.setScale(2, 0.8);

        const map = this.make.tilemap({ key: 'map' });
        const tileset = map.addTilesetImage('kenny_simple_platformer', 'tiles');
        const platforms = map.createStaticLayer('Platforms', tileset, 0, 200);

        platforms.setCollisionByExclusion(-1, true);

        this.player = this.physics.add.sprite(50,200,'player');
        this.player.setBounce(0.1);
        this.player.setCollideWorldBounds(true);
        this.physics.add.collider(this.player, platforms);


        this.anims.create({
        	key:'walk',
        	frames:this.anims.generateFrameNames('player', {
        		prefix:'robo_player_',
        		start:2,
        		end:3
        	}),
        	frameRate:10,
        	repeat:-1
        });
        this.anims.create({
        	key:'idle',
        	frames:[{key:'player', frame:'robo_player_0'}],
        	frameRate:10
        });

        this.anims.create({
        	key:'jump',
        	frames:[{key:'player', frame:'robo_player_1'}],
        	frameRate:10
        });

        this.cursor = this.input.keyboard.createCursorKeys();

        this.spikes = this.physics.add.group({
        	allowGravity:false,
        	immovable:true
        });

        const spikeObjects = map.getObjectLayer('Spikes')['objects'];
        spikeObjects.forEach(spikeObject => {
        	const spike = this.spikes.create(spikeObject.x, spikeObject.y + 200 - spikeObject.height, 'spike').setOrigin(0,0);
        	spike.body.setSize(spike.width, spike.height - 20).setOffset(0, 20);
        })
        this.physics.add.collider(this.player, this.spikes, playerHit, null, this);

        this.player.body.setSize(40, 60).setOffset(25,30);
    }
    update(delta) {
    	if(this.cursor.left.isDown){
    		this.player.setVelocityX(-200);
    		if(this.player.body.onFloor()){
    			this.player.play('walk', true);
    		}
    	}else if(this.cursor.right.isDown){
    		this.player.setVelocityX(200);
    		if(this.player.body.onFloor()){
    			this.player.play('walk', true);
    		}
    	}else{
    		this.player.setVelocityX(0);

    		if(this.player.body.onFloor()){
    			this.player.play('idle', true);
    		}
    	}

    	if((this.cursor.space.isDown || this.cursor.up.isDown)&& this.player.body.onFloor()){
    		this.player.setVelocityY(-350);
    		this.player.play('jump', true);
    	}
    	if(this.player.body.velocity.x > 0){
    		this.player.setFlipX(false);
    	}else if(this.player.body.velocity.x < 0){
    		this.player.setFlipX(true);
    	}
    }
}

export default GameScene;

function playerHit(player, spike){
	player.setVelocity(0, 0);
	player.setX(50);
	player.setY(300);
	player.play('idle', true);
	player.setAlpha(0);
	let tw = this.tweens.add({
		targets:player,
		alpha:1,
		duration:100,
		ease:'Linear',
		repeat:5
	});
}