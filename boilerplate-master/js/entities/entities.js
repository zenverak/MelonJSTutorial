game.PlayerEntity = me.ObjectEntity.extend({
	init: function(x,y,settings){
		this.parent(x,y,settings);
		this.setVelocity(4,15);
		this.updateColRect(8,48,-1,0);
		me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
	},
	update: function(){
		if(me.input.isKeyPressed("left")){
			this.flipX(true);
			this.vel.x-=this.accel.x * me.timer.tick;
		}else if(me.input.isKeyPressed("right")){
			this.flipX(false);
			this.vel.x =+ this.accel.x *me.timer.tick;
		} else{
			this.vel.x = 0;
		}
		if(me.input.isKeyPressed("jump")){
			if(!this.jumping&&!this.falling){
				this.vel.y = -this.maxVel.y * me.timer.tick;
				this.jumping = true;
			}
		}
		this.updateMovement();
		var res = me.game.collide(this);
		if(res){
			if(res.obj.type === me.game.ENEMY_OBJECT){
				if((res.y>0)&&!this.jumping){
					this.falling=false;
					this.vel.y = -this.maxVel.y * me.timer.tick;
					this.jumping = true;
				}else{
					this.renderable.flicker(45);
				}
			}
		}
		if (this.vel.x!=0|| this.vel.y!= 0){
			this.parent();
			return true;
		}
		return false;
	},

});
game.CoinEntity = me.CollectableEntity.extend({
	init: function(x,y,settings){
		this.parent(x,y,settings);
		this.image ="spinning_coin_gold";
	},
	onCollision: function(){
		this.collidable= false;
		me.game.remove(this);
	}
});

game.EnemyEntity = me.ObjectEntity.extend({
	init: function(x,y, settings){
		settings.image = "wheelie_right";
		settings.spritewidth = 64;
		this.parent(x,y,settings);
		this.startX = x;
		this.endX = x + settings.width - settings.spritewidth;
		
		this.pos.x = x + settings.width -settings.spritewidth;
		this.setVelocity(4,6);
		this.collidable = true;
		this.type = me.game.ENEMY_OBJECT;
	},
	onCollision: function(res,obj){
		if(this.alive&&(res.y>0)&&obj.falling){
			this.renderable.flicker(45);
		}
	},
	update: function(){
		if (!this.inViewport){
			return false;
		}
		if(this.alive){
			if(this.walkLeft&&this.posx<=this.startX){
				this.walkLeft = false;
			}else if(!this.walkLeft&&this.pos.x>=this.endX){
				this.walkLeft = true;
			}
			this.flipX(this.walkLeft);
			this.vel.x=+(this.walkLeft)?-this.accelx*me.timer.tick: this.accel.x * me.timer.tick;
		}else{
			this.vel.x = 0;
		}
		this.updateMovement();
		if(this.vel.x!==0 || this.vel.y!==0){
		 this.parent();
		 return true;
		}	
		return false;
		}
});