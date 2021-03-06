var BitSharesTickerContent = React.createClass({
    
    handleTweet: function(newTweet) {
        if (this.state.tweet !== newTweet) {
            var newState = this.state;
            newState.tweet = newTweet;
            this.setState(newState);
        }
    },
    handleHeartbeat: function() {
        var newState = this.state;
        newState.lastupdate = (new Date(parseInt(new Date().getTime()))).toLocaleString()
        this.setState(newState);
    },
    handlePriceChange: function(newPrice) {
        var newState = this.state;
        var newPriceList = this.state.filteredPriceList;
        i=0;
        this.state.filteredPriceList.map( function(priceitem) {
            if (priceitem.key === newPrice.key) {
                newPriceList[i].calc_value = newPrice.calc_value;
            }
            i+=1;
        })
        newState.lastupdate = (new Date(parseInt(new Date().getTime()))).toLocaleString()
        newState.filteredPriceList = newPriceList;
        this.setState(newState);
    },
    getInitialState: function() {
        var tweet = this.props.latest_tweet_text;
        var priceList = JSON.parse(this.props.price_list
            .replace(/\&quot\;/g,'"')
            .replace(/\\/g, "")
            .replace(/"{/g, '{')
            .replace(/}"/g, '}')
        );
        
        function notSurpressed(priceitem) {
          return priceitem.label !== 'SURPRESS';
        };
        
        return {
            tweet: tweet,
            lastupdate: (new Date(parseInt(new Date().getTime()))).toLocaleString(),
            filteredPriceList: priceList.filter(notSurpressed)
        }
    },
    componentWillMount: function() {
        var socket = io.connect();
        var self = this;
        socket.on('tweet', function (data) {
            self.handleTweet(data);
        });
        socket.on('price', function (newPrice) {
            self.handlePriceChange(newPrice);
        });
        socket.on('heartbeat', function () {
            self.handleHeartbeat();
        });
    },
    render: function() {
        var settings = {
            dots: false,
            infinite: true,
            slidesToShow: 5,
            slidesToScroll: 1,
            autoplay: true,
            autoplaySpeed: 4000,
            speed: 3500,
            variableWidth: true,
            lazyLoad: true,
            adaptiveHeight: false
        };
        var filteredPriceList = this.state.filteredPriceList;
        return (
                <Slider {...settings}>
                    {<div key={this.state.tweet}><Tweet tweet={this.state.tweet}></Tweet>&nbsp;&nbsp;</div>}
                    {<div key={this.state.lastupdate}><Timestamp lastupdate={this.state.lastupdate}></Timestamp>&nbsp;&nbsp;</div>}
                    {
                        filteredPriceList.map( function (priceitem) {
                            return(
                                <div key={priceitem}>
                                <PriceItem 
                                    alt={priceitem.alt}
                                    border={priceitem.border}
                                    height={priceitem.height}
                                    img_src={priceitem.img_src}
                                    label={priceitem.label}
                                    calc_value={priceitem.calc_value}
                                    raw_value={priceitem.raw_value}
                                    width={priceitem.width}
                                    align={priceitem.align}>
                                </PriceItem>
                                </div>
                            );
                        })
                    }
                </Slider>
        );
    }
});

